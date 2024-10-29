import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProviderFunction from "@/components/context/AppContext";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Manage your own blogs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ProviderFunction>
          <ToastContainer />
          <Navbar />
          <main className="px-2">{children}</main>
        </ProviderFunction>
      </body>
    </html>
  );
}
