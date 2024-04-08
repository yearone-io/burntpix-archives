import Footer from "@/components/Footer";
import Head from "next/head";
import { Providers } from "./providers";
import { WalletProvider } from "@/components/wallet/WalletProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <WalletProvider>
        <body>
          <Providers>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "105vh",
              }}
            >
              <div style={{ flexGrow: 1, height: "100%" }}>{children}</div>

              <Footer />
            </div>
          </Providers>
        </body>
      </WalletProvider>
    </html>
  );
}
