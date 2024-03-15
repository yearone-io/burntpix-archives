const { ethers } = require('ethers');

// Setup provider and contract
const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
const contractAddress = '0x4e8ba475570385e3cc35a0e40293035cd45b9be9';

function getElementIndexInStorage(arrayStartingIndexHexValue, arrayElementIndex) {
    return `0x${(BigInt(arrayStartingIndexHexValue) + BigInt(arrayElementIndex)).toString(16)}`;
}

// Read the length of the pixels array
async function readPixelData(pixelsArrayLengthSlot) {
    // Read the length of the pixels array
    const pixelsDataSlotStartIndex = ethers.solidityPackedKeccak256(['uint256'], [pixelsArrayLengthSlot]);
    //console.log('pixelsDataSlotStartIndex:', pixelsDataSlotStartIndex);

    const pixelsArrayLengthHex = await provider.getStorage(contractAddress, pixelsArrayLengthSlot);
    const pixelsArrayLength = Number(pixelsArrayLengthHex);

    const pixelStorageSlots = [];
    // Read pixel data from each slot
    for (let i = 0; i < pixelsArrayLength; i++) {
        const pixelDataSlotHash = getElementIndexInStorage(pixelsDataSlotStartIndex, i);
        pixelStorageSlots.push(pixelDataSlotHash);
    }
    // read the data in batches
    const pixelDataValues = await batchReadStorageSlots(contractAddress, pixelStorageSlots, 14);
    // write the results to file
    const fs = require('fs');
    fs.writeFileSync('pixelDataValues.json', JSON.stringify(pixelDataValues, null, 2));
}

// Call the function to read pixel data
readPixelData(5).then(pixelDataArray => {
    //console.log(pixelDataArray);
    // Further processing of pixelDataArray as needed
}).catch(error => {
    console.error("Failed to read pixel data:", error);
});

async function batchReadStorageSlots(contractAddress, slots, batchSize = 10) {
    const batchedSlots = [];
    for (let i = 0; i < slots.length; i += batchSize) {
        batchedSlots.push(slots.slice(i, i + batchSize));
    }

    const results = [];
    let batchNumber = 0;
    for (const slotBatch of batchedSlots) {
        // Wait for 3 seconds between each batch to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            const batchResults = await Promise.all(slotBatch.map(slot => provider.getStorage(contractAddress, slot)));
            console.log('Batch #:', batchNumber++);
            results.push(...batchResults);
        } catch (error) {
            console.error('Error reading storage slots:', error);
            // Continue to the next batch even if the current batch fails
        }
    }

    return results;
}