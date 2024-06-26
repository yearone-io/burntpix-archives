import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-toolbox";
require('hardhat-contract-sizer');
import { getNetworkAccountsConfig } from "./constants/network";

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.24",
		settings: {
		  optimizer: {
			enabled: true,
			runs: 1000,
		  },
		  viaIR: true
		},
	  },
	contractSizer: {
		alphaSort: true,
		runOnCompile: true,
		disambiguatePaths: false,
	  },
	// public LUKSO Testnet
	networks: {
		luksoTestnet: {
			url: "https://lukso-testnet.rpc.thirdweb.com",
			chainId: 4201,
			accounts: [getNetworkAccountsConfig("luksoTestnet").EOA_PRIVATE_KEY as string]
		},
		luksoMain: {
			url: "https://lukso.rpc.thirdweb.com",
			chainId: 42,
			accounts: [getNetworkAccountsConfig("luksoMain").EOA_PRIVATE_KEY as string]
		},
		luksoDevnet: {
			url: "https://rpc.devnet.lukso.dev",
			chainId: 7420,
			accounts: [getNetworkAccountsConfig("luksoTestnet").EOA_PRIVATE_KEY as string]
		},
	},
	sourcify: {
		enabled: false,
	},
	etherscan: {
		// no API is required to verify contracts
		// via the Blockscout instance of LUKSO Testnet
		apiKey: "no-api-key-needed",
		customChains: [
			{
				network: "luksoTestnet",
				chainId: 4201,
				urls: {
					apiURL: "https://api.explorer.execution.testnet.lukso.network/api",
					browserURL: "https://explorer.execution.testnet.lukso.network",
				},
			},
			{
				network: "luksoMain",
				chainId: 42,
				urls: {
					apiURL: "https://api.explorer.execution.mainnet.lukso.network/api",
					browserURL: "https://explorer.execution.mainnet.lukso.network",
				},
			},
			{
				network: "luksoDevnet",
				chainId: 7420,
				urls: {
					apiURL: "https://api.explorer.execution.devnet.lukso.dev/api",
					browserURL: "https://explorer.execution.devnet.lukso.dev",
				},
			},
		],
	},

	paths: {
		sources: "./contracts",
		tests: "./test",
		cache: "./cache",
		artifacts: "./artifacts",
		external: "./node_modules/[npm-package]/contracts"
	},
};

export default config;