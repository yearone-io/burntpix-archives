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
      url: `https://23b45ebdf7b26e5273aed14cc594be1b.serveo.net/images/socials-logo.png`,
    },
  },
  twitter: {
    images: {
      url: `https://23b45ebdf7b26e5273aed14cc594be1b.serveo.net/images/socials-logo.png`,
    },
    card: "summary_large_image",
  },
};

export default function Root() {
  return <Home />;
}
