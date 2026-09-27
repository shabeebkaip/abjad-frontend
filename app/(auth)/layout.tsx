import type { Metadata } from "next";
import AuthChrome from "./_components/AuthChrome";

export const metadata: Metadata = {
  title: "Abjad – Auth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthChrome>{children}</AuthChrome>;
}
