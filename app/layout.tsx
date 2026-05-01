import type { Metadata } from "next";
import { Geist, DM_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.royandresdev.com"),
  title: "Roy Huaman | royandresdev - Fullstack Developer",
  description: "Portafolio profesional de Roy Huaman (royandresdev), Fullstack Developer apasionado por crear software sólido, escalable y optimizado.",
  icons: {
    icon: "/Logo.svg",
  },
  alternates: {
    canonical: "/",
  },
  keywords: ["royandresdev", "Roy Huaman", "Fullstack Developer", "Desarrollador Web", "React", "Next.js"],
  authors: [{ name: "Roy Huaman" }],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Ajusta según tus necesidades
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://vggtrffoascdbyqxdccw.supabase.co" />
      </head>
      <body className={`${geistSans.variable} ${dmSans.variable} antialiased font-dm-sans`}>
        {children}
      </body>
    </html>
  );
}
