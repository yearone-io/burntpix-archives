import "./globals.css";
import { Metadata } from "next";
import Home from "@/components/Home";
import { getNetworkConfig } from "@/constants/networks";

const title = "Burnt Pix Archives";
const description = "All the Pixels, That Are Fit To Burn";
const networkConfig = getNetworkConfig(
  process.env.NEXT_PUBLIC_DEFAULT_NETWORK!,
);
export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    type: "website",
    url: networkConfig.domain,
    images: {
      url: `${networkConfig.domain}/images/socials-logo.png`,
    },
  },
  twitter: {
    images: {
      url: `${networkConfig.domain}/images/socials-logo.png`,
    },
    card: "summary_large_image",
  },
};

export default function Root() {
  return <Home />;
}
