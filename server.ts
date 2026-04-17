import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
// In some environments, this will pick up credentials automatically.
// If not, it will fallback to the project name.
try {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "aliko-dangote-foundation"
  });
} catch (error) {
  console.log("Firebase Admin already initialized or could not initialize:", error);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Paystack Verification Endpoint
  app.post("/api/verify-payment", async (req, res) => {
    const { reference } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is not defined in environment variables");
      return res.status(500).json({ status: false, message: "Server configuration error" });
    }

    try {
      // Use standard fetch (available in Node.js 18+)
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });

      const data = await response.json() as any;

      if (data.status && data.data.status === "success") {
        // Amount check could go here if needed
        res.json({ status: true, message: "Transaction verified", data: data.data });
      } else {
        res.status(400).json({ status: false, message: data.message || "Transaction verification failed" });
      }
    } catch (error) {
      console.error("Paystack verification error:", error);
      res.status(500).json({ status: false, message: "An error occurred during verification" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
