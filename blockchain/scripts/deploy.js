const hre = require("hardhat");

async function main() {
  // Step 1: Deploy ExamManager
  console.log("Deploying ExamManager...");
  const ExamManager = await hre.ethers.getContractFactory("ExamManager");
  const examManager = await ExamManager.deploy();
  await examManager.waitForDeployment(); 
  const examManagerAddress = await examManager.getAddress();
  console.log("✅ ExamManager deployed to:", examManagerAddress);

  // Step 2: Deploy StudentRegistry
  console.log("Deploying StudentRegistry...");
  const StudentRegistry = await hre.ethers.getContractFactory("StudentRegistry");
  const studentRegistry = await StudentRegistry.deploy();
  await studentRegistry.waitForDeployment();  
  const studentRegistryAddress = await studentRegistry.getAddress();
  console.log("✅ StudentRegistry deployed to:", studentRegistryAddress);

  // Step 3: Deploy ExamSubmissionManager (requires ExamManager & StudentRegistry addresses)
  console.log("Deploying ExamSubmissionManager...");
  const ExamSubmissionManager = await hre.ethers.getContractFactory("ExamSubmissionManager");
  const examSubmissionManager = await ExamSubmissionManager.deploy(examManagerAddress, studentRegistryAddress);
  await examSubmissionManager.waitForDeployment();  
  const examSubmissionManagerAddress = await examSubmissionManager.getAddress();
  console.log("✅ ExamSubmissionManager deployed to:", examSubmissionManagerAddress);

  // Step 4: Deploy ExamResults (requires ExamManager & ExamSubmissionManager addresses)
  console.log("Deploying ExamResults...");
  const ExamResults = await hre.ethers.getContractFactory("ExamResults");
  const examResults = await ExamResults.deploy(examManagerAddress, examSubmissionManagerAddress);
  await examResults.waitForDeployment();  
  const examResultsAddress = await examResults.getAddress();
  console.log("✅ ExamResults deployed to:", examResultsAddress);

  console.log("\n🎉 All contracts deployed successfully!");
  console.log(`📌 ExamManager: ${examManagerAddress}`);
  console.log(`📌 StudentRegistry: ${studentRegistryAddress}`);
  console.log(`📌 ExamSubmissionManager: ${examSubmissionManagerAddress}`);
  console.log(`📌 ExamResults: ${examResultsAddress}`);
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
