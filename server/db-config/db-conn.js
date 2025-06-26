import mongoose from "mongoose";

let isConnected;

export const connA = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) return mongoose;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maximum number of connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    isConnected = db.connections[0].readyState;
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};
