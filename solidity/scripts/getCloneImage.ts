const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import RegistryClone from "../artifacts/contracts/RegistryClone.sol/RegistryClone.json";
const fs = require('fs');

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;

async function writeBurntPicToFile() {
    const cloneAddress = "0x2567d61e45e67789e503533B0ad84BC1656d474d";
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(cloneAddress, RegistryClone.abi, signer);
    const image = await contract.getSVGArchive(BigInt(369));
    fs.writeFileSync('pixelDataValues.svg', image);
}

writeBurntPicToFile().then(() => {
    console.log('Done');
}).catch(error => {
    console.error('Error:', error);
});