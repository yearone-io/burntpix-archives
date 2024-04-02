export const numberToBytes32 = (num: number): string => {
  // Convert the number to a hex string
  let hexString = num.toString(16);

  // Pad the hex string with zeros to ensure it is 64 characters long
  hexString = hexString.padStart(64, "0");

  // Prepend '0x' to denote a hex value
  return "0x" + hexString;
};

export const hexToText = (hexString: string): string => {
  // Remove the '0x' prefix if present
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  // Convert the hex string to a Buffer, then to a UTF-8 string
  const text = Buffer.from(hexString, "hex").toString("utf8");
  return text;
};
