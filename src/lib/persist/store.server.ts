import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { getCatalogItem, promotionClaimAmountMnt } from "@/lib/bonus/admin-config";
import type { PublicUser, StoredSession, StoredUser } from "@/lib/auth/types";
import type { PromotionClaim } from "@/lib/claims/types";
import type { BonusId } from "@/lib/bonus/types";
import { notifyClaim } from "@/lib/notify/telegram";
import { readAppStore, writeAppStore, type AppStore } from "@/lib/persist/blobs.server";

const scryptAsync = promisify(scrypt);

const SESSION_COOKIE = "promo_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;

let writeQueue: Promise<void> = Promise.resolve();

async function withStore<T>(fn: (store: AppStore) => Promise<T> | T): Promise<T> {
  const run = writeQueue.then(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 4; attempt++) {
      const { data: store, etag } = await readAppStore();
      const now = Date.now();
      store.sessions = store.sessions.filter((session) => new Date(session.expiresAt).getTime() > now);
      const result = await fn(store);
      try {
        const written = await writeAppStore(store, etag);
        if (written) return result;
        lastError = new Error("Failed to persist application store.");
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Failed to persist application store.");
  });
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt.toString("base64")}:${key.toString("base64")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, hashB64] = stored.split(":");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  const actual = (await scryptAsync(password, salt, 64)) as Buffer;
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

function toPublicUser(user: StoredUser): PublicUser {
  return { id: user.id, username: user.username, createdAt: user.createdAt };
}

function setSessionCookie(sessionId: string) {
  setCookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_MS / 1000),
  });
}

export type AuthResult = { ok: true; user: PublicUser } | { ok: false; error: string };

export async function registerUser(input: {
  username: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResult> {
  const username = input.username.trim();
  if (!USERNAME_PATTERN.test(username)) {
    return { ok: false, error: "Username must be 3–24 letters, numbers, or underscores." };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (input.password !== input.confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }

  return withStore(async (store) => {
    const taken = store.users.some((user) => user.username.toLowerCase() === username.toLowerCase());
    if (taken) return { ok: false, error: "That username is already taken." };

    const user: StoredUser = {
      id: randomBytes(12).toString("hex"),
      username,
      passwordHash: await hashPassword(input.password),
      createdAt: new Date().toISOString(),
    };
    const session: StoredSession = {
      id: randomBytes(24).toString("hex"),
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_MS).toISOString(),
    };
    store.users.push(user);
    store.sessions.push(session);
    setSessionCookie(session.id);
    return { ok: true, user: toPublicUser(user) };
  });
}

export async function loginUser(input: { username: string; password: string }): Promise<AuthResult> {
  const username = input.username.trim();
  if (!username || !input.password) {
    return { ok: false, error: "Username and password are required." };
  }

  return withStore(async (store) => {
    const user = store.users.find((entry) => entry.username.toLowerCase() === username.toLowerCase());
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      return { ok: false, error: "Invalid username or password." };
    }
    store.sessions = store.sessions.filter((session) => session.userId !== user.id);
    const session: StoredSession = {
      id: randomBytes(24).toString("hex"),
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_MS).toISOString(),
    };
    store.sessions.push(session);
    setSessionCookie(session.id);
    return { ok: true, user: toPublicUser(user) };
  });
}

export async function logoutUser() {
  const sessionId = getCookie(SESSION_COOKIE);
  await withStore(async (store) => {
    if (sessionId) {
      store.sessions = store.sessions.filter((session) => session.id !== sessionId);
    }
  });
  deleteCookie(SESSION_COOKIE, { path: "/" });
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const sessionId = getCookie(SESSION_COOKIE);
  if (!sessionId) return null;
  return withStore((store) => {
    const session = store.sessions.find((entry) => entry.id === sessionId);
    if (!session) return null;
    const user = store.users.find((entry) => entry.id === session.userId);
    return user ? toPublicUser(user) : null;
  });
}

export type ClaimResult =
  | { ok: true; claim: PromotionClaim }
  | { ok: false; error: string; code?: "unauthorized" | "duplicate" };

export async function createPendingClaim(bonusId: BonusId): Promise<ClaimResult> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return { ok: false, error: "Please log in to claim.", code: "unauthorized" };

  const catalog = getCatalogItem(bonusId);
  const amountMnt = promotionClaimAmountMnt[bonusId];

  return withStore(async (store) => {
    const duplicate = store.claims.some(
      (claim) => claim.userId === sessionUser.id && claim.bonusId === bonusId,
    );
    if (duplicate) {
      return { ok: false, error: "You already submitted a claim for this promotion.", code: "duplicate" };
    }

    const claim: PromotionClaim = {
      id: randomBytes(12).toString("hex"),
      userId: sessionUser.id,
      username: sessionUser.username,
      bonusId,
      promotionTitle: catalog.title,
      amountMnt,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    store.claims.push(claim);
    await notifyClaim(claim);
    return { ok: true, claim };
  });
}

export async function listSessionClaims(): Promise<PromotionClaim[]> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return [];
  return withStore((store) => store.claims.filter((claim) => claim.userId === sessionUser.id));
}
