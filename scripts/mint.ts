import { ethers } from "hardhat";

async function main() {
    // Connect to the deployed Faet contract
    const faetAddress = "0x865aeE3E5B136e6bEFd311F487A99491c5e016e1"; // Replace with your deployed contract address
    const FaetFactory = await ethers.getContractFactory("Faet");
    const faet = FaetFactory.attach(faetAddress);

    // Specify the recipient address and the IPFS CID of the metadata
    const recipient = "0xE9C67872F3018e034308b44BA5DfFA46711Be1bF"; // Replace with the recipient's address
    const quantity = 1;
    const ipfsCIDs = ["bafybeidv3wcemqzps47e66fgfidxziicqjz4cspbdyhjn7vzdtcxrgrz54"]; // Replace with the metadata JSON CID from Pinata

    // Mint the NFT
    const mintTx = await faet.mintNFT(recipient, quantity, ipfsCIDs);
    await mintTx.wait();

    console.log(`Minted NFT with metadata IPFS CID: ${ipfsCIDs[0]} to ${recipient}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
