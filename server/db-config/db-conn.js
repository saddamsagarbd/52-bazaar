import mongoose from "mongoose";

let isConnected;

const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Mongo connection timed out")), ms)
  );

export const connA = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) return mongoose;

  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    // const db = await mongoose.connect(process.env.MONGO_URI, {
    //   maxPoolSize: 10, // Maximum number of connections
    //   serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    //   socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    // });
    const db = await Promise.race([
      mongoose.connect(process.env.MONGO_URI, options),
      timeout(8000),
    ]);

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};
