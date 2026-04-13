import type { Metadata } from "next";
import "./globals.css";
import { Almarai, Bricolage_Grotesque, Cinzel } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";

const almarai = Almarai({
  weight: ["300", "400", "700", "800"],
  subsets: ["arabic"],
  variable: "--font-almarai",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

/**
 * Cinzel is the closest freely available Google Font to Trajan Pro Regular.
 * It is used for brand headings per Abjad brand guidelines.
 */
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Abjad – Connect Teachers & Schools",
  description: "Abjad is a hiring platform connecting talented teachers with schools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Runs BEFORE paint — prevents flash of wrong direction/font */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('abjad_lang')||'en';document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.setAttribute('data-lang',l);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${almarai.variable} ${bricolage.variable} ${cinzel.variable} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
