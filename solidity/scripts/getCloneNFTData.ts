const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import BurntPixArchives from "../artifacts/contracts/BurntPixArchives.sol/BurntPixArchives.json";
const fs = require('fs');

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY, UP_ADDR } = process.env;


async function getCloneNFTData() {
    const registryAddress = "";
    const tokenId = "";
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(registryAddress, BurntPixArchives.abi, signer);
    const metadataKey = "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e";
    const metadata = await contract.getDataForTokenId(tokenId, metadataKey);
    fs.writeFileSync('tokenData.txt', metadata);
}

getCloneNFTData().then(() => {
    console.log('Done');
}).catch(error => {
    console.error('Error:', error);
});