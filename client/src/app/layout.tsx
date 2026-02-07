import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Smart Appointment & Queue Manager",
  description:
    "Manage appointments, staff scheduling, and waiting queues efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
