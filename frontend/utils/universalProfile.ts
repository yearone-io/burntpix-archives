import { SiweMessage } from "siwe";
import { getNetworkConfig } from "@/constants/networks";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import { LSP3ProfileMetadata } from "@lukso/lsp3-contracts";
import { constants } from "@/constants/constants";

export const buildSIWEMessage = (upAddress: string): string => {
  const siweParams = {
    domain: window.location.host, // required, Domain requesting the signing
    uri: window.location.origin, // required, URI from the resource that is the subject of the signing
    address: upAddress, // Address performing the signing
    statement:
      "Welcome Welcome my Friiiend, please make sure you have read and understood our terms of service and conditions and privacy policy. By signing in, you confirm that you have read and agree to these documents and will use the platform in accordance with their provisions. Thank you for using Universal GRAVE, and we hope we solve all your spam problems once and for all.", // a human-readable assertion user signs
    version: "1", // Current version of the SIWE Message
    chainId: getNetworkConfig(process.env.NEXT_PUBLIC_DEFAULT_NETWORK!).chainId, // Chain ID to which the session is bound, 4201 is LUKSO Testnet
    resources: [
      `${window.location.origin}/terms`,
      `${window.location.origin}/terms#disclaimer`,
      `${window.location.origin}/terms#privacy`,
    ], // Information the user wishes to have resolved as part of authentication by the relying party
  };
  return new SiweMessage(siweParams).prepareMessage();
};

export const getProfileData = async (
  universalProfileAddress: string,
  rpcUrl: string,
): Promise<LSP3ProfileMetadata> => {
  const erc725js = new ERC725(
    lsp3ProfileSchema as ERC725JSONSchema[],
    universalProfileAddress,
    rpcUrl,
    {
      ipfsGateway: constants.IPFS_GATEWAY,
    },
  );

  const profileData = await erc725js.fetchData("LSP3Profile");
  return (profileData!.value as { LSP3Profile: Record<string, any> })
    .LSP3Profile as LSP3ProfileMetadata;
};

export const formatAddress = (address: string | null) => {
  if (!address) return '0x';
  if (address.length < 10) return address; // '0x' is an address
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};