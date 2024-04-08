import { Inter, PT_Serif } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const interBold = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: "700",
});

export const ptSerifBold = PT_Serif({
  subsets: ["latin"],
  weight: "700",
});

export const ptSerifNormal = PT_Serif({
  subsets: ["latin"],
  weight: "400",
});
