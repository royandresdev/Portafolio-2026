import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.royandresdev.com"),
  title: "Roy Huaman | Fullstack Developer",
  description: "Portafolio profesional de Roy Huaman, Fullstack Developer apasionado por el software sólido y profesional.",
  icons: {
    icon: "/Logo.svg",
  },
  alternates: {
    canonical: "/",
  },
  keywords: ["Fullstack Developer", "React", "Next.js", "Roy Huaman", "Portafolio"],
  authors: [{ name: "Roy Huaman" }],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
