const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import BurntPixArchives from "../artifacts/contracts/BurntPixArchives.sol/BurntPixArchives.json";
const fs = require('fs');

// load env vars
dotenv.config();
// Update those values in the .env file
const { EOA_PRIVATE_KEY } = process.env;


async function getCloneNFTData() {
    const archivesAddress = "0xBEbe51Cb346f95Ce4d6529D4a565fb8342c25074";
    const tokenId = "0x0000000000000000000000004e8ba475570385e3cc35a0e40293035cd45b9be9";
    const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
    const signer = new ethers.Wallet(EOA_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(archivesAddress, BurntPixArchives.abi, signer);
    /*
    const metadataKey = "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e";
    const metadata = await contract.getDataForTokenId(tokenId, metadataKey, {
        gasLimit: 41_000_000n,
      });
    fs.writeFileSync('tokenData.txt', metadata);*/
    const user = "0xF1258b31ADaf74F0886E0952BD50C78DF70a54AD";
    const contributions = await contract.contributions(user);
    console.log(contributions);
}

getCloneNFTData().then(() => {
    console.log('Done');
}).catch(error => {
    console.error('Error:', error);
});