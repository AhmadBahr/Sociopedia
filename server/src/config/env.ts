import dotenv from "dotenv";

dotenv.config();

const required = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "5000", 10),
  mongoUri: required("MONGO_URI", process.env.MONGO_URI),
  jwtSecret: required("JWT_SECRET", process.env.JWT_SECRET),
  clientUrl: required("CLIENT_URL", process.env.CLIENT_URL),
} as const;

