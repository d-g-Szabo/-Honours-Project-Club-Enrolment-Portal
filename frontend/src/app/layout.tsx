import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Club Membership Portal",
  description: "A simple membership portal for clubs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-muted min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
