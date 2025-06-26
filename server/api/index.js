import serverless from "serverless-http";
import app from "../server.js";

const isProd = process.env.NODE_ENV === "production";

// Always export the handler (for Vercel)
export const handler = serverless(app);

// In dev, also start the server
if (!isProd) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}