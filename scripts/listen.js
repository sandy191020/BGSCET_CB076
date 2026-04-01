const hre = require("hardhat");

async function main() {
  // Use the current contract address from your .env
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  try {
    const GreenLedger = await hre.ethers.getContractAt("GreenLedger", contractAddress);

    console.log("");
    console.log("==================================================");
    console.log("🟢 GREENLEDGER BLOCKCHAIN MONITOR ACTIVE");
    console.log(`📍 Monitoring: ${contractAddress}`);
    console.log("📡 Status: Awaiting Transactions...");
    console.log("==================================================");

    // Listen for Minting Events
    GreenLedger.on("CreditsMinted", (farmer, farmId, amount, satelliteHash, score) => {
      process.stdout.write("\x07"); // Terminal Beep for extra "wow" factor
      console.log("\n[+] NEW BLOCKCHAIN TRANSACTION CONFIRMED!");
      console.log(`👤 Farmer:    ${farmer}`);
      console.log(`🆔 Farm ID:   ${farmId}`);
      console.log(`🌱 Amount:    ${amount} Carbon Credits`);
      console.log(`📊 Score:     ${score}/100 NDVI`);
      console.log(`🔗 IPFS:      ipfs://${satelliteHash.slice(0, 15)}...`);
      console.log("--------------------------------------------------");
    });

    // Keep the script running indefinitely
    await new Promise(() => {}); 
  } catch (error) {
    console.error("❌ Link Error: Make sure your Hardhat node is running and the contract at", contractAddress, "is deployed.");
    console.error(error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
