import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AskMilo – Learn Smarter. CS Made Simple.",
  description: "Your AI-powered guide to mastering core Computer Science topics with clear answers and follow-ups tailored to your questions.",
  icons: {
    icon: "/idea.png", 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
