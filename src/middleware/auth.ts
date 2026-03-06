import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getSecretForRole } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

/**
 * General authenticate middleware.
 * Step 1: Decode WITHOUT verification to read the `role` claim.
 * Step 2: Verify with the correct role-specific secret.
 * This ensures tokens cannot cross role boundaries.
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Step 1: Peek at the payload to determine the role (decode without verify)
    const unverified = jwt.decode(token) as {
      userId: string;
      role: string;
    } | null;

    if (!unverified?.role) {
      return res.status(401).json({ message: "Invalid token: missing role" });
    }

    // Step 2: Verify with the role-specific secret
    const secret = getSecretForRole(unverified.role);
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Role-restricted authenticate middleware factory.
 * Enforces that the token was signed for the expected role.
 * Useful for routes that should only be accessible by a specific role.
 */
export const authenticateRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const unverified = jwt.decode(token) as {
        userId: string;
        role: string;
      } | null;

      if (!unverified?.role) {
        return res.status(401).json({ message: "Invalid token: missing role" });
      }

      // Reject early if role not in the allowed list
      if (!allowedRoles.includes(unverified.role)) {
        return res.status(403).json({
          message: `Forbidden: requires ${allowedRoles.join(" or ")} role`,
        });
      }

      const secret = getSecretForRole(unverified.role);
      const decoded = jwt.verify(token, secret) as {
        userId: string;
        role: string;
      };

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
