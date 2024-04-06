import "./globals.css";
import { constants } from "@/constants/constants";
import { Metadata } from "next";
import Home from "@/components/Home";

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
    images: {
      url: `${constants.DOMAIN}/images/socials-logo.png`,
    },
  },
  twitter: {
    images: {
      url: `${constants.DOMAIN}/images/socials-logo.png`,
    },
    card: "summary_large_image",
  },
};

export default function Root() {
  return <Home />;
}
