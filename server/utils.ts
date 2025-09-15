import jsonwebtoken, { SignOptions } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const createJWT = async (
  user: { _id: string; email: string; name: string },
  options: SignOptions = { expiresIn: "30d" }
) => {
  return jsonwebtoken.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    options
  );
};

export const verifyJWT = async (token: string) => {
  try {
    const payload = jsonwebtoken.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      name: string;
    };

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Middleware function to protect routes
export const requireAuth = async (authHeader: string | undefined) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  return await verifyJWT(token);
};
