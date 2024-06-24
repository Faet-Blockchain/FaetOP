import { ethers } from "hardhat";

async function main() {
    // Connect to the deployed Faet contract
    const faetAddress = "0x865aeE3E5B136e6bEFd311F487A99491c5e016e1"; // Replace with your deployed contract address
    const FaetFactory = await ethers.getContractFactory("Faet");
    const faet = FaetFactory.attach(faetAddress);

    // Specify the token ID you want to query
    const tokenId = 0;

    // Fetch the token data
    const tokenData = await faet.getTokenData(tokenId);
    console.log(`Token data for token ID ${tokenId}: ${tokenData}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
