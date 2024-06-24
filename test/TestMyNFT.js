const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Faet", function () {
  let Faet;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    const FaetFactory = await ethers.getContractFactory("Faet");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const faet = await FaetFactory.deploy(owner.address);
    await faet.waitForDeployment();
    const faetAddress = await faet.getAddress();
    Faet = await ethers.getContractAt("Faet", faetAddress);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await Faet.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await Faet.name()).to.equal("Faet");
      expect(await Faet.symbol()).to.equal("FAET");
    });
  });

  describe("Transactions", function () {
    it("Should mint multiple NFTs with unique URIs", async function () {
      await Faet.connect(owner).mintNFT(owner.address, 1, ["ipfs://URI_1"]);
      expect(await Faet.balanceOf(owner.address)).to.equal(1);
      const ipfsCID = await Faet.getTokenData(0); // Token ID starts at 0
      expect(ipfsCID).to.equal("ipfs://URI_1");

      await Faet.connect(owner).mintNFT(owner.address, 2, ["ipfs://URI_2", "ipfs://URI_3"]);
      expect(await Faet.balanceOf(owner.address)).to.equal(3);
      const ipfsCID2 = await Faet.getTokenData(1); // Adjusted for 0-based index
      expect(ipfsCID2).to.equal("ipfs://URI_2");
      const ipfsCID3 = await Faet.getTokenData(2); // Adjusted for 0-based index
      expect(ipfsCID3).to.equal("ipfs://URI_3");
    });

    it("Should update total supply when minted", async function () {
      expect(await Faet.totalSupply()).to.equal(0);

      await Faet.connect(owner).mintNFT(owner.address, 3, ["ipfs://URI_7", "ipfs://URI_8", "ipfs://URI_9"]);
      expect(await Faet.totalSupply()).to.equal(3);

      await Faet.connect(owner).mintNFT(owner.address, 2, ["ipfs://URI_10", "ipfs://URI_11"]);
      expect(await Faet.totalSupply()).to.equal(5);
    });

    it("Should fail if minting NFT to zero address", async function () {
      await expect(Faet.connect(owner).mintNFT("0x0000000000000000000000000000000000000000", 1, ["ipfs://URI_1"]))
        .to.be.revertedWith("Faet: cannot mint to the zero address");
    });

    it("Should fail if minting NFT with zero quantity", async function () {
      await expect(Faet.connect(owner).mintNFT(owner.address, 0, []))
        .to.be.revertedWith("Faet: quantity must be greater than zero");
    });

    it("Should fail if quantity does not match URIs length", async function () {
      await expect(Faet.connect(owner).mintNFT(owner.address, 2, ["ipfs://URI_1"]))
        .to.be.revertedWith("Faet: IPFS CIDs length mismatch with quantity");
    });
  });
});
