import hre, { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import ReturnSizedArray from "../artifacts/contracts/ReturnSizedArray.sol/ReturnSizedArray.json";
import config from '../hardhat.config';
import { getNetworkAccountsConfig } from '../constants/network';

// load env vars
const network = hre.network.name;
console.log('NETWORK: ', network);
const { EOA_PRIVATE_KEY } = getNetworkAccountsConfig(network as string);

async function main() {
  // network setup
  const provider = new ethers.JsonRpcProvider(config.networks[network].url);
  const signer = new ethers.Wallet(EOA_PRIVATE_KEY as string, provider);
  // deployment config
  const ReturnSizedArrayFactory = new ethers.ContractFactory(
    ReturnSizedArray.abi,
    ReturnSizedArray.bytecode,
  );
  const onchainArchives = await ReturnSizedArrayFactory.connect(signer).deploy(
    {
      gasLimit: 41_000_000n
    }
  );
  await onchainArchives.waitForDeployment();

  console.log(`to manually verify run: npx hardhat verify --network ${network} ${onchainArchives.target}`);
  try {
    await hre.run("verify:verify", {
      address: onchainArchives.target,
      network
    });
    console.log("Contract verified");
  } catch (error) {
    console.error("Contract verification failed:", error);
  }
  console.log('✅ ReturnSizedArray deployed. Address:', onchainArchives.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });