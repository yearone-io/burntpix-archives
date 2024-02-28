const { expect } = require("chai");
const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import HouseOfBurntPix from "../artifacts/contracts/HouseOfBurntPix.sol/HouseOfBurntPix.json";

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;


describe("MyContract", function () {
  it("Should return the latest image successfully", async function () {
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
    // deployment config
    const collectionName = "HouseOfBurntPix";
    const symbol = "HOP";
    const contractOwner = UP_ADDR;
    const maxArchiveNFTs = 100;
    const burntpixCollection = "0x12167f1c2713aC4f740B4700c4C72bC2de6C686f";
    const burntpicId = "0x0000000000000000000000004e8ba475570385e3cc35a0e40293035cd45b9be9";
    const constructorArguments = [collectionName, symbol, contractOwner, maxArchiveNFTs, burntpixCollection, burntpicId];
    const HouseOfBurntPixFactory = new ethers.ContractFactory(
      HouseOfBurntPix.abi,
      HouseOfBurntPix.bytecode,
    );
    const houseDeployTx = await HouseOfBurntPixFactory.connect(signer).deploy(
      ...constructorArguments,
    );
    await houseDeployTx.waitForDeployment();
  
    // Verify the contract after deployment
    try {
      await hre.run("verify:verify", {
        address: houseDeployTx.target,
        network: "luksoTestnet",
        constructorArguments: [
          ...constructorArguments,
        ],
      });
      console.log("Contract verified");
    } catch (error) {
      console.error("Contract verification failed:", error);
    }
    console.log('✅ House deployed. Address:', houseDeployTx.target);


    const latestImage = await houseDeployTx.getLatestImage();
    console.log("Latest Image:", latestImage);
    expect(latestImage).to.be.a('string');
  });
});
