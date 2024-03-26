
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
import {Spacer} from "@chakra-ui/react";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Spacer />
      <ConnectKitButton />
    </nav>
  );
}
