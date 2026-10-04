export interface PublicUser {
  id: string;
  username: string;
  createdAt: string;
}

export interface StoredUser extends PublicUser {
  passwordHash: string;
}

export interface StoredSession {
  id: string;
  userId: string;
  expiresAt: string;
}
