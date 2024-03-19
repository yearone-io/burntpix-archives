const { expect } = require("chai");
const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import BurntPixArchives from "../artifacts/contracts/BurntPixArchives.sol/BurntPixArchives.json";

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;


describe("MyContract", function () {
  it.skip("Should return the latest image successfully", async function () {
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
    // deployment config
    const collectionName = "BurntPixArchives";
    const symbol = "HOP";
    const contractOwner = UP_ADDR;
    const maxArchiveNFTs = 100;
    const burntpixCollection = "0x12167f1c2713aC4f740B4700c4C72bC2de6C686f";
    const burntpicId = "0x0000000000000000000000004e8ba475570385e3cc35a0e40293035cd45b9be9";
    const constructorArguments = [collectionName, symbol, contractOwner, maxArchiveNFTs, burntpixCollection, burntpicId];
    const BurntPixArchivesFactory = new ethers.ContractFactory(
      BurntPixArchives.abi,
      BurntPixArchives.bytecode,
    );
    const houseDeployTx = await BurntPixArchivesFactory.connect(signer).deploy(
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

  it("getLatestImage should work on write function", async function () {
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
    // deployment config
    const collectionName = "BurntPixArchives";
    const symbol = "HOP";
    const contractOwner = UP_ADDR;
    const maxArchiveNFTs = 100;
    const burntpixCollection = "0x12167f1c2713aC4f740B4700c4C72bC2de6C686f";
    const burntpicId = "0x0000000000000000000000004e8ba475570385e3cc35a0e40293035cd45b9be9";
    const constructorArguments = [collectionName, symbol, contractOwner, maxArchiveNFTs, burntpixCollection, burntpicId];
    const BurntPixArchivesFactory = new ethers.ContractFactory(
      BurntPixArchives.abi,
      BurntPixArchives.bytecode,
    );
    const houseDeployTx = await BurntPixArchivesFactory.connect(signer).deploy(
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


    const latestImage = await houseDeployTx.refineToMint(1, UP_ADDR, {gasLimit: 400_000});
    console.log('latestImage:', latestImage);
    
    const a = await latestImage.wait(); // Wait for the transaction to be mined

    console.log('a:', a);

    // Listen for the event (this is a generic approach, adjust based on your setup)
    // const logs = await latestImage.wait();
    // const events = logs.events?.filter((e) => e.event === "ImageUpdated");
    // if (events && events.length > 0) {
    //     const latestImage = events[0].args.image;
    //     console.log(latestImage);
    // }
    
  });

  // next we add tests for all the functions from BurntPixArchives.sol that fetch and set image as well as the metadata
  // the functions in question are getAndSetImage(), getAndSetImageUsingGetData(), getAndSetImageUsingGetDataForTokenId(), getAndSetMetadata(), getAndSetMetadataUsingGetDataForTokenId()
  it("getAndSetImage should work", async function () {
    
    
  
});
