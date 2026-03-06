import jwt from "jsonwebtoken";

type Role = "admin" | "therapist" | "client";

/**
 * Returns the correct JWT secret for each role.
 * Each role gets a distinct secret so tokens cannot cross boundaries.
 */
export const getSecretForRole = (role: string): string => {
  switch (role) {
    case "admin":
      return process.env.JWT_SECRET_ADMIN || "admin_fallback_secret";
    case "therapist":
      return process.env.JWT_SECRET_THERAPIST || "therapist_fallback_secret";
    case "client":
    default:
      return process.env.JWT_SECRET_CLIENT || "client_fallback_secret";
  }
};

/**
 * Generate a short-lived access token signed with the role-specific secret.
 */
export const generateAccessToken = (userId: string, role: string): string => {
  const secret = getSecretForRole(role);
  return jwt.sign({ userId, role }, secret, { expiresIn: "15m" });
};

/**
 * Generate a long-lived refresh token using the shared refresh secret.
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || "refreshSecret",
    { expiresIn: "7d" },
  );
};
