import { getStore, type Store } from "@netlify/blobs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredSession, StoredUser } from "@/lib/auth/types";
import type { PromotionClaim } from "@/lib/claims/types";

export interface AppStore {
  users: StoredUser[];
  sessions: StoredSession[];
  claims: PromotionClaim[];
}

export const emptyStore = (): AppStore => ({ users: [], sessions: [], claims: [] });

const BLOB_STORE = "promo-app";
const BLOB_KEY = "state";
const RUNTIME_STORE_PATH = path.join(process.cwd(), "data", "runtime-store.json");

type PersistGlobal = typeof globalThis & {
  __promoMemoryStore?: AppStore | null;
  __promoBlobClient?: Store | null;
};

function persistGlobal(): PersistGlobal {
  return globalThis as PersistGlobal;
}

function env(name: string) {
  return process.env[name];
}

function isNetlifyRuntime() {
  return Boolean(
    env("NETLIFY") || env("NETLIFY_DEV") || env("NETLIFY_BLOBS_CONTEXT") || env("AWS_LAMBDA_FUNCTION_NAME"),
  );
}

function isMissingBlobsConfig(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("not been configured to use Netlify Blobs") ||
    message.includes("supply the following properties")
  );
}

function openBlobStore(): Store {
  const siteID = env("NETLIFY_SITE_ID");
  const token = env("NETLIFY_BLOBS_TOKEN") ?? env("NETLIFY_AUTH_TOKEN");
  if (siteID && token) {
    return getStore({
      name: BLOB_STORE,
      siteID,
      token,
      consistency: "strong",
    });
  }
  return getStore({ name: BLOB_STORE, consistency: "strong" });
}

function resolveBlobStore(): Store | null {
  const g = persistGlobal();
  if ("__promoBlobClient" in g && g.__promoBlobClient !== undefined) return g.__promoBlobClient;
  try {
    g.__promoBlobClient = openBlobStore();
    return g.__promoBlobClient;
  } catch (error) {
    if (isNetlifyRuntime() || !isMissingBlobsConfig(error)) {
      throw error;
    }
    g.__promoBlobClient = null;
    return null;
  }
}

function normalize(parsed: Partial<AppStore> | null | undefined): AppStore {
  return {
    users: parsed?.users ?? [],
    sessions: parsed?.sessions ?? [],
    claims: parsed?.claims ?? [],
  };
}

/** One-time read of the old JSON file. Never mkdir/write. */
async function loadLegacySeed(): Promise<AppStore | null> {
  try {
    const raw = await readFile(path.join(process.cwd(), "data", "store.json"), "utf8");
    return normalize(JSON.parse(raw) as Partial<AppStore>);
  } catch {
    return null;
  }
}

async function loadRuntimeStore(): Promise<AppStore | null> {
  try {
    const raw = await readFile(RUNTIME_STORE_PATH, "utf8");
    return normalize(JSON.parse(raw) as Partial<AppStore>);
  } catch {
    return null;
  }
}

async function saveRuntimeStore(data: AppStore): Promise<void> {
  await mkdir(path.dirname(RUNTIME_STORE_PATH), { recursive: true });
  await writeFile(RUNTIME_STORE_PATH, JSON.stringify(data), "utf8");
}

async function ensureMemoryStore(): Promise<AppStore> {
  const g = persistGlobal();
  if (!g.__promoMemoryStore) {
    g.__promoMemoryStore = (await loadRuntimeStore()) ?? (await loadLegacySeed()) ?? emptyStore();
  }
  return g.__promoMemoryStore;
}

export async function readAppStore(): Promise<{ data: AppStore; etag?: string }> {
  try {
    const blobs = resolveBlobStore();
    if (!blobs) {
      const fromDisk = await loadRuntimeStore();
      if (fromDisk) {
        persistGlobal().__promoMemoryStore = fromDisk;
        return { data: structuredClone(fromDisk) };
      }
      return { data: structuredClone(await ensureMemoryStore()) };
    }

    const result = await blobs.getWithMetadata(BLOB_KEY, { type: "json", consistency: "strong" });
    if (result?.data) {
      const data = normalize(result.data as Partial<AppStore>);
      return result.etag ? { data, etag: result.etag } : { data };
    }

    const seed = (await loadRuntimeStore()) ?? (await loadLegacySeed());
    return { data: seed ?? emptyStore() };
  } catch (error) {
    if (isNetlifyRuntime() || !isMissingBlobsConfig(error)) {
      throw error;
    }
    persistGlobal().__promoBlobClient = null;
    const fromDisk = await loadRuntimeStore();
    if (fromDisk) {
      persistGlobal().__promoMemoryStore = fromDisk;
      return { data: structuredClone(fromDisk) };
    }
    return { data: structuredClone(await ensureMemoryStore()) };
  }
}

export async function writeAppStore(data: AppStore, etag?: string): Promise<boolean> {
  try {
    const blobs = resolveBlobStore();
    if (!blobs) {
      persistGlobal().__promoMemoryStore = structuredClone(data);
      await saveRuntimeStore(data);
      return true;
    }

    const result = etag
      ? await blobs.setJSON(BLOB_KEY, data, { onlyIfMatch: etag })
      : await blobs.setJSON(BLOB_KEY, data);
    return result.modified;
  } catch (error) {
    if (isNetlifyRuntime() || !isMissingBlobsConfig(error)) {
      throw error;
    }
    persistGlobal().__promoBlobClient = null;
    persistGlobal().__promoMemoryStore = structuredClone(data);
    await saveRuntimeStore(data);
    return true;
  }
}
