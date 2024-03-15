const fs = require('fs');
const PNG = require('pngjs').PNG;

/*
function decodeValue(hexStr) {
    const bigint = BigInt(hexStr);
    
    // Extract RGB values assuming they might be using the upper portion of their segments
    const r = Number((bigint >> BigInt(48)) & BigInt(0xFFFF));
    const g = Number((bigint >> BigInt(32)) & BigInt(0xFFFF));
    const b = Number((bigint >> BigInt(16)) & BigInt(0xFFFF));
  
    // Extract the A value
    const aBigInt = bigint & BigInt(0xFFFF);
    // Normalize the alpha value to 0-1 range
    const a = Number(aBigInt) / 0xFFFF;
  
    // Convert alpha to 0-255 for PNG data and ensure R, G, B are within bounds
    return [r, g, b, Math.round(a * 255)];
}
*/
function decodeValue(hexStr) {
/*
    const parsedHex = hexStr.substring(2,66);
    const a
    console.log(parsedHex)
*/
    const rgbParse = 0xFFFF;
    const aParse = 0xFFFF;
    const bigint = BigInt(hexStr);
    
    // Extract RGB values assuming they might be using the upper portion of their segments
    const r = Number((bigint >> BigInt(48)) & BigInt(rgbParse));
    const g = Number((bigint >> BigInt(32)) & BigInt(rgbParse));
    const b = Number((bigint >> BigInt(16)) & BigInt(rgbParse));
    //console.log("rgb", r, g, b)
  
    // Extract the A value
    const aBigInt = bigint & BigInt(aParse);
    // Normalize the alpha value to 0-1 range
    const a = Number(aBigInt) / aParse;
  
    // Convert alpha to 0-255 for PNG data and ensure R, G, B are within bounds
    return [r, g, b, Math.round(a * 255)];

}
  
function createScaledPngFromEncodedFile(inputFile, outputFile, scale) {
    fs.readFile(inputFile, (err, data) => {
      if (err) throw err;
      const encodedValues = JSON.parse(data);
      const width = 64 * scale;
      const height = 64 * scale;
      const png = new PNG({
        width: width,
        height: height,
        filterType: -1
      });
  
      encodedValues.forEach((hex, i) => {
        //const [r, g, b, a] = getEncodedRGBA(hex);
        const [r, g, b, a] = decodeValue(hex);
        const originalX = i % 64;
        const originalY = Math.floor(i / 64);
        
        for (let y = 0; y < scale; y++) {
          for (let x = 0; x < scale; x++) {
            const idx = ((originalY * scale + y) * width + (originalX * scale + x)) * 4;
            png.data[idx] = r;
            png.data[idx + 1] = g;
            png.data[idx + 2] = b;
            png.data[idx + 3] = a;
          }
        }
      });
  
      png.pack().pipe(fs.createWriteStream(outputFile));
    });
  }

// Usage
// Call the function to read pixel data
const inputFile = 'pixelDataValues.json';
const outputFile = 'burntPixels.png';

function getEncodedRGBA(hexStr) {
    const rgbScaleDown = 100000;
    const aScaleDown = 100;
    const parsedHex = hexStr.substring(2,66);
    const r = `0x${parsedHex.substring(0, 16)}`;
    const g = `0x${parsedHex.substring(16, 32)}`;
    const b = `0x${parsedHex.substring(32, 48)}`;
    const a = `0x${parsedHex.substring(48, 64)}`;
    return [
        Number(BigInt(r))/rgbScaleDown,
        Number(BigInt(g))/rgbScaleDown,
        Number(BigInt(b))/rgbScaleDown,
        Number(BigInt(a))/aScaleDown
    ];
} 

async function main() {
  // "0x000000000007bd0e0000000000010b5900000000000efd6b00000000000f4240"
  // "0x00000000000edada000000000001b4ca00000000001e5a4c00000000001e8480"
  createScaledPngFromEncodedFile(inputFile, outputFile, 16);
  //console.log(pixelDataArray);
  // Further processing of pixelDataArray as needed
  const hexStr1 = "0x000000000007bd0e0000000000010b5900000000000efd6b00000000000f4240";
  const hexStr2 = "0x00000000000edada000000000001b4ca00000000001e5a4c00000000001e8480";
  console.log(getEncodedRGBA(hexStr1));
  console.log(getEncodedRGBA(hexStr2));
  console.log(decodeValue(hexStr1));
  console.log(decodeValue(hexStr2));
}

main().then(() => {
    console.log('png created', inputFile, '->', outputFile);
}).catch(error => {
    console.error("Failed to read pixel data:", error);
});
