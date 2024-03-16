const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import RegistryClone from "../artifacts/contracts/RegistryClone.sol/RegistryClone.json";
const fs = require('fs');

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;

async function writeBurntPicToFile() {
    const cloneAddress = "0x28914a2D248e18b8BAb3e67277934bB40A3123e7";
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(cloneAddress, RegistryClone.abi, signer);
    const image = await contract.getSVGArchive(BigInt(2069));
    fs.writeFileSync('pixelDataValues.svg', image);
}

writeBurntPicToFile().then(() => {
    console.log('Done');
}).catch(error => {
    console.error('Error:', error);
});