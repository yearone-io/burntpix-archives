const { ethers } = require("hardhat");
import * as dotenv from 'dotenv';
import BurntPixArchives from "../artifacts/contracts/BurntPixArchives.sol/BurntPixArchives.json";
import config from '../hardhat.config';
import { getNetworkAccountsConfig } from '../constants/network';
// issuing assets
import { ERC725 } from '@erc725/erc725.js';
import LSP12Schema from '@erc725/erc725.js/schemas/LSP12IssuedAssets.json';
import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts';

// load env vars
dotenv.config();
const { NETWORK } = process.env;
console.log('NETWORK: ', NETWORK);
const { EOA_PRIVATE_KEY, UP_ADDR_CONTROLLED_BY_EOA, CODEHUB, REGISTRY, ARCHIVE_HELPERS } = getNetworkAccountsConfig(NETWORK as string);

async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider(config.networks[NETWORK].url);
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const contractOwner = UP_ADDR_CONTROLLED_BY_EOA;
  const burntpicId = "0x000000000000000000000000245f9a8bea516165b45142f8b79ea204f97f8867";
  const maxSupply = 10000;
  const winnerGoal = 69_000;
  const constructorArguments = [CODEHUB, ARCHIVE_HELPERS, contractOwner, burntpicId, maxSupply, winnerGoal];
  const BurntPixArchivesFactory = new ethers.ContractFactory(
    BurntPixArchives.abi,
    BurntPixArchives.bytecode,
  );
  const onchainArchives = await BurntPixArchivesFactory.connect(signer).deploy(
    ...constructorArguments,{
      gasLimit: 41_000_000n,
    }
  );
  await onchainArchives.waitForDeployment();

  // Verify the contract after deployment
  try {
    await hre.run("verify:verify", {
      address: onchainArchives.target,
      network: NETWORK,
      constructorArguments: [
        ...constructorArguments,
      ],
    });
    console.log("Contract verified");
  } catch (error) {
    console.error("Contract verification failed:", error);
  }
  console.log('✅ Burnt Pix Archives deployed. Address:', onchainArchives.target);
  // registering issued asset
  const issuedAssets = [
    {
      interfaceId: INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
      address: onchainArchives.target
    }
  ];
  const erc725 = new ERC725(
    LSP12Schema,
    contractOwner,
    config.networks[NETWORK].url,
  );
  const allAssetAddresses = issuedAssets.map((asset) => asset.address);
  const issuedAssetsMap = issuedAssets.map((asset, index) => {
    return {
      keyName: 'LSP12IssuedAssetsMap:<address>',
      dynamicKeyParts: asset.address,
      value: [
        asset.interfaceId,
        ERC725.encodeValueType('uint128', index),
      ],
    };
  });
  const { keys: lsp12DataKeys, values: lsp12Values } = erc725.encodeData([
    { keyName: 'LSP12IssuedAssets[]', value: allAssetAddresses },
    ...issuedAssetsMap,
  ]);
  const myUPContract = new ethers.Contract(
    contractOwner,
    UniversalProfileArtifact.abi,
    signer,
  );
  try {
    const response = await myUPContract.setDataBatch(lsp12DataKeys, lsp12Values);
    console.log('✅ Issued assets registered:', response);
  } catch (error) {
    console.error("Failled to add issued asset:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });