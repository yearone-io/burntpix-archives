import SignInButton from "@/components/SignInButton";
import { inter } from "@/app/fonts";

declare global {
  interface Window {
    lukso: any;
    ethereum: any;
  }
}
import React, { useContext } from "react";
import { WalletContext } from "./WalletContext";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { formatAddress } from "@/utils/tokenUtils";
import { VscDebugDisconnect } from "react-icons/vsc";

/**
 * The WalletConnector component allows users to connect or disconnect their LUKSO wallets.
 * It utilizes the WalletContext for state management and to access the necessary actions.
 */
const WalletConnector: React.FC = () => {
  const walletContext = useContext(WalletContext);

  // If the context is not available, throw an error. This component must be used within a WalletProvider.
  if (!walletContext) {
    throw new Error("WalletConnector must be used within a WalletProvider.");
  }
  const { account, disconnect, isLoadingAccount } = walletContext;

  const displayConnectButton = () => {
    if (isLoadingAccount) {
      return <button disabled>Loading...</button>;
    } else if (!account) {
      return <SignInButton />;
    } else {
      return (
        <Menu>
          <MenuButton
            as={Button}
            color={"dark.purple.500"}
            border={"1px solid var(--chakra-colors-dark-purple-500)"}
            size={{ base: "xs", md: "sm" }}
            fontFamily={inter.style.fontFamily}
            fontSize={{ base: "12px", md: "14px" }}
            lineHeight={{ base: "12px", md: "14px" }}
          >
            {formatAddress(account)}
          </MenuButton>
          <MenuList
            fontSize={{ base: "12px", md: "14px" }}
            lineHeight={{ base: "12px", md: "14px" }}
          >
            <MenuItem onClick={disconnect} icon={<VscDebugDisconnect />}>
              Disconnect
            </MenuItem>
          </MenuList>
        </Menu>
      );
    }
  };

  return <div>{displayConnectButton()}</div>;
};

export default WalletConnector;
