import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Report from "./models/report.js";

dotenv.config();

async function runTests() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI_AUTH);
  console.log("Connected!");

  try {
    // 1. Try to create a Citizen User (should succeed without empId and department)
    console.log("\n--- Test 1: Creating Citizen User ---");
    const citizenEmail = `test_citizen_${Date.now()}@example.com`;
    const citizen = await User.create({
      name: "Test Citizen",
      email: citizenEmail,
      password: "password123",
      role: "Citizen",
      city: "Ranchi",
      contact: "1234567890",
      acceptedTerms: true,
    });
    console.log("✅ Citizen User Created Successfully:", citizen._id, citizen.email, citizen.role);

    // 2. Try to create an Employee User (should fail without empId)
    console.log("\n--- Test 2: Creating Staff User without empId (Should Fail) ---");
    try {
      await User.create({
        name: "Test Staff Fail",
        email: `test_staff_fail_${Date.now()}@example.com`,
        password: "password123",
        role: "Staff",
        city: "Ranchi",
        contact: "1234567890",
        department: "Sanitation",
        acceptedTerms: true,
      });
      console.log("❌ Staff creation without empId unexpectedly succeeded!");
    } catch (err) {
      console.log("✅ Staff creation without empId failed as expected:", err.message);
    }

    // 3. Try to create an Employee User with empId (should succeed)
    console.log("\n--- Test 3: Creating Staff User with empId (Should Succeed) ---");
    const staffEmail = `test_staff_${Date.now()}@example.com`;
    const employeeId = `JH_TEST_${Date.now()}`;
    const staff = await User.create({
      name: "Test Staff Success",
      email: staffEmail,
      password: "password123",
      role: "Staff",
      city: "Ranchi",
      contact: "1234567890",
      department: "Sanitation",
      empId: employeeId,
      acceptedTerms: true,
    });
    console.log("✅ Staff User Created Successfully:", staff._id, staff.email, staff.role, staff.empId);

    // 4. Try to create a Report by Citizen
    console.log("\n--- Test 4: Creating Report linked to Citizen ---");
    const report = await Report.create({
      reportId: `NS-TEST-${Date.now()}`,
      problemType: "Water Pipe Leak",
      description: "Leakage in street number 4",
      city: "Ranchi",
      department: "Water Supply",
      location: {
        locationName: "Albert Ekka Chowk, Ranchi",
      },
      userId: citizen._id,
    });
    console.log("✅ Report Created Successfully:", report.reportId, "linked to userId:", report.userId);

    // Clean up test data
    console.log("\nCleaning up test database entries...");
    await User.deleteOne({ _id: citizen._id });
    await User.deleteOne({ _id: staff._id });
    await Report.deleteOne({ _id: report._id });
    console.log("Clean up finished!");

  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runTests();
