"use client";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Article from "@/components/Article";
import SignInButton from "@/components/SignInButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let title = "Burntpix Archives";

  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`./images/logo-text.png`} />
        <meta name="twitter:card" content="summary"></meta>
      </Head>
      <WalletProvider>
        <body>
          <ChakraProvider theme={theme}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "105vh",
              }}
            >
              <Navbar />
              <div style={{ flexGrow: 1 }}>{children}</div>
              <Article title="LIVE VIEW" description="In a First, LUKSO Community Works to Refine and Archive the Same Burnt Pic Together.">
                {<SignInButton />}
              </Article>
              <Footer />
            </div>
          </ChakraProvider>
        </body>
      </WalletProvider>
    </html>
  );
}
