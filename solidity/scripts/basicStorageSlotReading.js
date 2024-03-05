const { ethers } = require('ethers');

// Connect to the LUKSO testnet
const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');

// The contract address you're interested in
const contractAddress = '0x4E8BA475570385e3CC35A0e40293035cD45B9BE9';

//for loop

for (let i = 0; i <25; i++) {
    readInternalVariable(i);

}

// The storage slot index you want to read; this is an example, you'll need to know the exact slot.

async function readInternalVariable(i) {
    const storageSlot = i +
        ''; // Adjust this based on the variable's position in the contract

    try {
        // Read the storage slot from the contract address
        const value = await provider.getStorage(contractAddress, storageSlot);
        if(value !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
            console.log(`Value at storage slot ${storageSlot}:`, value);
        } else {
            console.log(`nothing at ${storageSlot}:`, value);
        }
    } catch (error) {
        console.error('Error reading storage slot:', error);
    }
}