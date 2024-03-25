export const formatAddress = (address: string | null) => {
  if (!address) return '0x';
  if (address.length < 10) return address; // '0x' is an address
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};
