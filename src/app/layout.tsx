import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instant Dashboard Generator",
  description: "Generate beautiful dashboards from JSON data using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
