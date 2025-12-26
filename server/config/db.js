import mongoose from "mongoose";

// Default connection for Users/Auth
const connectAuthDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_AUTH);
    console.log(`✅ Auth DB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Auth DB Error: ${error.message}`);
    process.exit(1);
  }
};

// Separate connection for Reports
const connectReportsDB = async () => {
  try {
    const reportsConn = await mongoose.createConnection(process.env.MONGO_URI_REPORTS);
    console.log(`✅ Reports DB Connected: ${reportsConn.name}`); // shows DB name
    return reportsConn; // export this to define Report models
  } catch (error) {
    console.error(`❌ Reports DB Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectAuthDB, connectReportsDB };
