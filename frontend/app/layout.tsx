import Footer from "@/components/instructionsComponent/navigation/footer";
import Head from "next/head";
import { Providers } from "./providers";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { Metadata } from "next";
import { constants } from "@/constants/constants";

const title = "Burntpix Archives";
const description = "All the Pixels, That Are Fit To Burn";
export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    type: "website",
    url: `${constants.DOMAIN}`,
    images: [`${constants.DOMAIN}/images/logo.png`],
  },
  twitter: {
    card: "summary_large_image",
  },
};

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
