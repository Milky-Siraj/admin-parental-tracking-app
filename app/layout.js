import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Parental Tracking | For Autistic Children",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
