const hre = require("hardhat");

async function main() {
  console.log("Deploying GreenLedger contract...");

  const GreenLedger = await hre.ethers.getContractFactory("GreenLedger");
  
  // Using a placeholder base URI for the demo
  const baseURI = "https://greenledger.ai/metadata/";
  
  const greenLedger = await GreenLedger.deploy(baseURI);

  await greenLedger.waitForDeployment();

  const address = await greenLedger.getAddress();
  console.log("GreenLedger deployed to:", address);
  console.log("Check your .env file and update NEXT_PUBLIC_CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
