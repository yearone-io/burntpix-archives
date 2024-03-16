const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import FractalArchiveFactory from "../artifacts/contracts/FractalArchiveFactory.sol/FractalArchiveFactory.json";
import FractalCloneFactory from "../artifacts/contracts/FractalCloneFactory.sol/FractalCloneFactory.json";

// deploys fractal factories and console logs the addresses of the deployed contracts

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;

async function main() {
    // network setup
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
    // deployment config
    const FractalArchiveFactoryContract = new ethers.ContractFactory(
        FractalArchiveFactory.abi,
        FractalArchiveFactory.bytecode,
    );
    const FractalCloneFactoryContract = new ethers.ContractFactory(
        FractalCloneFactory.abi,
        FractalCloneFactory.bytecode,
    );
    const onchainFractalArchiveFactory = await FractalArchiveFactoryContract.connect(signer).deploy();
    await onchainFractalArchiveFactory.waitForDeployment();
    const onchainFractalCloneFactory = await FractalCloneFactoryContract.connect(signer).deploy();
    await onchainFractalCloneFactory.waitForDeployment();
    console.log('✅ FractalArchiveFactory deployed. Address:', onchainFractalArchiveFactory.target);
    console.log('✅ FractalCloneFactory deployed. Address:', onchainFractalCloneFactory.target);
    // verify 
    try {
        await hre.run("verify:verify", {
            address: onchainFractalArchiveFactory.target,
            network: "luksoTestnet",
        });
        await hre.run("verify:verify", {
            address: onchainFractalCloneFactory.target,
            network: "luksoTestnet",
        });
        console.log("Contract verified");
    } catch (error) {
        console.error("Contract verification failed:", error);
    }
}

main().then(() => {
    console.log('Done');
}).catch(error => {
    console.error('Error:', error);
});
