import { environment } from "./config";

export const FRONTEND_URL = environment.FRONTEND_URL;

export const allowedOrigins = [
  new URL("http://localhost:3000").origin,
  new URL(FRONTEND_URL!).origin,
];
