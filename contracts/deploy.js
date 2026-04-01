const hre = require("hardhat");

async function main() {
  console.log("Deploying GreenLedger contract to Polygon Mumbai testnet...");

  const baseMetadataURI = "ipfs://QmYourBaseMetadataHash/";

  const GreenLedger = await hre.ethers.getContractFactory("GreenLedger");
  const greenLedger = await GreenLedger.deploy(baseMetadataURI);

  await greenLedger.waitForDeployment();

  const contractAddress = await greenLedger.getAddress();

  console.log("✅ GreenLedger deployed to:", contractAddress);
  console.log("📝 Save this address to your .env.local file as NEXT_PUBLIC_CONTRACT_ADDRESS");
  console.log("🔗 View on PolygonScan:", `https://mumbai.polygonscan.com/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
