"use client";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import Head from "next/head";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Article from "@/components/Article";
import MainStatsList from "@/components/MainStatsList";
import RefineButton from "@/components/RefineButton";
import EditorsNote from "@/components/EditorsNote";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let title = "Burntpix Archives";

  const mainStats =
    // TODO Generate function that returns the dynamic stats
    [
      { label: "Iterations:", value: "0".toLocaleString() },
      { label: "Contributors:", value: "0".toLocaleString() },
      {
        label: "Archive Mints:",
        value: `${"0".toLocaleString()} / ${"0".toLocaleString()}`,
      },
      { label: "LYX Burned:", value: `${"0"} LYX` },
    ];

  const userStats =
    // TODO Generate function that returns the dynamic stats
    [
      { label: "Iterations:", value: "0".toLocaleString() },
      { label: "Archive Unlocks:", value: "0".toLocaleString() },
      {
        label: "Archive Mints:",
        value: "0".toLocaleString(),
      },
      { label: "Iters Till Next Archive:", value: "0".toLocaleString() },
    ];

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
              <Article
                title="LIVE VIEW"
                description="In a First, LUKSO Community Works to Refine and Archive the Same Burnt Pic Together"
              >
                {
                  <Box>
                    <MainStatsList stats={mainStats} />
                    <RefineButton />
                  </Box>
                }
              </Article>

              <Article title="YOUR CONTRIBUTIONS">
                <MainStatsList stats={userStats} />
              </Article>
              <EditorsNote />
              <Footer />
            </div>
          </ChakraProvider>
        </body>
      </WalletProvider>
    </html>
  );
}
