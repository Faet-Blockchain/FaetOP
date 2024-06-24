import { ethers } from "hardhat";

async function main() {
    const FaetFactory = await ethers.getContractFactory("Faet");
    const Faet = await FaetFactory.deploy("0xE9C67872F3018e034308b44BA5DfFA46711Be1bF");

    // Wait for the contract to be deployed and become confirmed
    await Faet.waitForDeployment();

    console.log("Contract deployed to:", Faet.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
