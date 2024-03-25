"use client";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { WalletProvider } from "@/components/wallet/WalletProvider";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: "demo",

    // Required
    appName: "You Create Web3 Dapp",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's logo,no bigger than 1024x1024px (max. 1MB)
  })
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let title = 'Burntpix Archives';

  return (
    <html lang="en">
      <WalletProvider>
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
        <WagmiConfig config={config}>
          <ConnectKitProvider mode="dark">
            <body>
              <div style={{ display: "flex", flexDirection: "column", minHeight: "105vh" }}>
                <Navbar />
                <div style={{flexGrow: 1}}>{children}</div>
                <Footer />
              </div>
            </body>
          </ConnectKitProvider>
        </WagmiConfig>
      </WalletProvider>
    </html>
  );
}
