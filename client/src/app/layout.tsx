import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LCCompanySheet",
  description: "Company wise sheet for LC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
