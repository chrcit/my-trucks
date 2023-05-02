import clsx from "clsx";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "MyTrucks",
  description: "Locate your trucks anytime, anywhere.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={clsx(
          "flex min-h-screen flex-col justify-between",
          inter.variable
        )}
      >
        <header className="py-10 px-5 text-center container mx-auto">
          <h1 className="text-4xl text-stone-700 font-bold">
            MyTrucks – Track your vehicles
          </h1>
        </header>
        <main className="flex-grow px-5 pb-10 container mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
