import { SiweMessage } from "siwe";
import { getNetworkConfig } from "@/constants/networks";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import { LSP3ProfileMetadata } from "@lukso/lsp3-contracts";
import { constants } from "@/constants/constants";
import { inter } from "@/app/fonts";

export const buildSIWEMessage = (upAddress: string): string => {
  const siweParams = {
    domain: window.location.host, // required, Domain requesting the signing
    uri: window.location.origin, // required, URI from the resource that is the subject of the signing
    address: upAddress, // Address performing the signing
    statement:
      "Welcome to The Burnt Pix Archives, where art meets blockchain in a spectacle of blazed pixels and communal refinements. By signing this message, you signal your acceptance to embark on this quest and participate in an art experiment with no expectations. Our only goal is to transform a single Burnt Pix fractal into a collaborative art masterpiece. Once the experiment is launched there will be no updates, no fixes, no core team or community, no nothing. The Burnt Pix Archives are provided as is.",
    version: "1", // Current version of the SIWE Message
    chainId: getNetworkConfig(process.env.NEXT_PUBLIC_DEFAULT_NETWORK!).chainId, // Chain ID to which the session is bound, 4201 is LUKSO Testnet
    resources: [window.location.origin], // Information the user wishes to have resolved as part of authentication by the relying party
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

export interface IProfileBasicInfo {
  upName: string | null;
  avatar: string | null;
}

export interface IProfiles {
  [key: string]: IProfileBasicInfo;
}

export const getProfileBasicInfo = async (
  contributor: string,
  rpcUrl: string,
): Promise<IProfileBasicInfo> => {
  let upName = null,
    avatar = null;
  try {
    const profileData = await getProfileData(contributor, rpcUrl);

    if (profileData) {
      if (profileData.profileImage && profileData.profileImage.length > 0) {
        avatar = `${constants.IPFS_GATEWAY}/${profileData.profileImage[0].url.replace("ipfs://", "")}`;
      }
      upName = profileData.name;
    }
  } catch (error) {
    console.error("Error fetching profile data for", contributor, error);
  } finally {
    return { upName, avatar };
  }
};

export const formatAddress = (address: string | null) => {
  if (!address) return "0x";
  if (address.length < 10) return address; // '0x' is an address
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};
