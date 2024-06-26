import hre, { ethers } from 'hardhat';
import BurntPixArchives from "../artifacts/contracts/BurntPixArchives.sol/BurntPixArchives.json";
import config from '../hardhat.config';
import { getNetworkAccountsConfig } from '../constants/network';
// issuing assets
import { ERC725 } from '@erc725/erc725.js';
import LSP12Schema from '@erc725/erc725.js/schemas/LSP12IssuedAssets.json';
import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts';

// load env vars
const network = hre.network.name;
console.log('network: ', network);
const { EOA_PRIVATE_KEY, UP_ADDR_CONTROLLED_BY_EOA, CODEHUB, ARCHIVE_HELPERS, BURNTPIC_ID, MAX_SUPPLY, MULTIPLIER, WINNER_ITERATIONS } = getNetworkAccountsConfig(network as string);

async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider(config.networks[network].url);
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const creator = UP_ADDR_CONTROLLED_BY_EOA;
  const royaltiesRecipient = UP_ADDR_CONTROLLED_BY_EOA;
  const burntpicId = BURNTPIC_ID;
  const maxSupply = MAX_SUPPLY;
  const winnerGoal = WINNER_ITERATIONS;
  const constructorArguments = [CODEHUB, ARCHIVE_HELPERS, creator, royaltiesRecipient, burntpicId, maxSupply, MULTIPLIER, winnerGoal];
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
    creator,
    config.networks[network].url,
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
    creator,
    UniversalProfileArtifact.abi,
    signer,
  );
  try {
    const response = await myUPContract.setDataBatch(lsp12DataKeys, lsp12Values);
    console.log('✅ Issued assets registered:', response);
  } catch (error) {
    console.error("Failled to add issued asset:", error);
  }
   // Verify the contract after deployment
   let stringArgs = "";
   for (let i = 0; i < constructorArguments.length; i++) {
       stringArgs += constructorArguments[i] + " ";
   }
   console.log(`to manually verify run: npx hardhat verify --network ${network} ${onchainArchives.target} ${stringArgs}`);
   try {
     await hre.run("verify:verify", {
       address: onchainArchives.target,
       network: network,
       constructorArguments: [
         ...constructorArguments,
       ],
     });
     console.log("Contract verified");
   } catch (error) {
     console.error("Contract verification failed:", error);
   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });