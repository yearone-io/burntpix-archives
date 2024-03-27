import React, { ReactNode, useEffect, useState } from "react";
import { DEFAULT_PROVIDER, WalletContext } from "./WalletContext";
import Web3 from "web3";
import { useToast } from "@chakra-ui/react";
import { getNetworkConfig } from "@/constants/networks";
import { getProvider } from "@/utils/provider";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { buildSIWEMessage } from "@/utils/universalProfile";

// Extends the window object to include `lukso`, which will be used to interact with LUKSO blockchain.
declare global {
  interface Window {
    lukso: any;
  }
}

// Defines the shape of props expected by the WalletProvider component.
interface Props {
  children: ReactNode;
}

/**
 * WalletProvider is a React component that provides wallet state and functionality
 * to its children via React Context API.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} - A provider component that passes down wallet context.
 */
export const WalletProvider: React.FC<Props> = ({ children }) => {
  const networkConfig = getNetworkConfig(
    process.env.NEXT_PUBLIC_DEFAULT_NETWORK!,
  );
  const [provider, setProvider] = useState<JsonRpcProvider | Web3Provider>(
    DEFAULT_PROVIDER,
  );
  const [account, setAccount] = useState<string | null>(null);
  const [mainUPController, setMainUPController] = useState<string>();
  const [isLoadingAccount, setIsLoadingAccount] = useState<boolean>(true);
  const [connectedChainId, setConnectedChainId] = useState<
    number | undefined
  >();

  const toast = useToast();

  useEffect(() => {
    const initProvider = getProvider(networkConfig);
    setProvider(initProvider);
  }, [connectedChainId, mainUPController]);

  // Effect hook to check for an existing connected account in localStorage when the component mounts.
  useEffect(() => {
    if (typeof window !== "undefined" && window.lukso) {
      // Retrieve the account from localStorage if it exists.
      const storedAccount = localStorage.getItem("connectedAccount");
      const storedMainUPController = localStorage.getItem("mainUPController");
      if (storedAccount) {
        setAccount(storedAccount);
      }
      if (storedMainUPController) {
        setMainUPController(storedMainUPController);
      }
      setIsLoadingAccount(false);
    }
  }, []);

  /**
   * Disconnects the wallet, removes the account address from state and localStorage.
   */
  const disconnect = () => {
    // Clear the account address from state.
    setAccount(null);
    setConnectedChainId(undefined);
    // Remove the stored account from localStorage.
    localStorage.removeItem("connectedAccount");
    localStorage.removeItem("mainUPController");
    // If additional logic is needed for disconnecting, it should be added here.
  };

  /**
   * Connects to the wallet and sets the account address in state and localStorage.
   */
  const connect = async () => {
    if (typeof window !== "undefined" && window.lukso) {
      // Initialize a new Web3 instance using the LUKSO provider.
      const web3 = new Web3(window.lukso);
      setConnectedChainId(Number(await web3.eth.getChainId()));
      let accounts: string[] = [];
      try {
        // Request accounts from the wallet.
        accounts = await web3.eth.requestAccounts();
        if (!accounts.length) {
          throw new Error("No user accounts found");
        }
        const connectedAccount = accounts[0];
        console.log("Connected with", connectedAccount);
        // To enable the Sign-In With Ethereum (SIWE) screen, you need to prepare a message with a specific format
        const siweMessage = buildSIWEMessage(connectedAccount);
        const signature = await web3.eth.personal.sign(
          siweMessage,
          connectedAccount,
          "",
        );
        // Request the user to sign the login message with his Universal Profile
        // The UP Browser Extension will sign the message with the controller key used by the extension (a smart contract can't sign)
        const signerAddress = web3.eth.accounts.recover(
          siweMessage,
          signature as string,
        );
        console.log("The account's Main Controller address is:", signerAddress);
        // Update state and localStorage with the first account address.
        setAccount(connectedAccount);
        setMainUPController(signerAddress);
        localStorage.setItem("connectedAccount", connectedAccount);
        localStorage.setItem("mainUPController", signerAddress);
      } catch (error: any) {
        // Log any connection errors.
        if (accounts.length) {
          disconnect();
        }
        const message =
          error && error.error && error.error.message
            ? error.error.message
            : "An unknown error occurred";
        const toastMessage = `Connection error: ${message}`;
        console.error(toastMessage);
        toast({
          title: toastMessage,
          status: "error",
          position: "bottom-left",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      // Inform the user if the LUKSO wallet extension is not installed.
      const message =
        "Please install the LUKSO Universal Profile Extension to use this app.";
      console.log(message);
      toast({
        title: `${message}`,
        status: "info",
        duration: 9000,
        position: "bottom-left",
        isClosable: true,
      });
    }
  };

  // Render the context provider, passing down the account state and control functions to children.
  return (
    <WalletContext.Provider
      value={{
        provider,
        account,
        mainUPController,
        connect,
        disconnect,
        isLoadingAccount,
        networkConfig,
        connectedChainId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};