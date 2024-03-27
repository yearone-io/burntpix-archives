"use client";

import WalletConnector from "@/components/wallet/WalletConnector";
import styles from "./navbar.module.css";
import { Spacer } from "@chakra-ui/react";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Spacer />
      <WalletConnector />
    </nav>
  );
}
