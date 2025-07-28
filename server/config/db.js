// FILE: server/config/db.js

import mongoose from 'mongoose';

// This function will connect our application to the MongoDB database.
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we use await.
    // We get the connection string from our environment variables.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log the host name.
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error connecting, log the error and exit the process.
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
};

// Export the function so we can use it in our main server.js file
export default connectDB;
