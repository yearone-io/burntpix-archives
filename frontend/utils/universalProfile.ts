import { SiweMessage } from "siwe";
import { getNetworkConfig } from "@/constants/networks";

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