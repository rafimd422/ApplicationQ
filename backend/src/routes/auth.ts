import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/index";
import { users } from "../db/schema/index";
import { signupSchema, loginSchema } from "../validators/index";
import { eq } from "drizzle-orm";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = Router();

// Signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
      })
      .returning({ id: users.id, email: users.email, name: users.name });

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    );

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    throw error;
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    throw error;
  }
});

// Get current user
router.get(
  "/me",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, req.userId!))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      throw error;
    }
  },
);

export default router;
