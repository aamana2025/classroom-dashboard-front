import { Cairo } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./Context/AppContext";
import Script from "next/script";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata = {
  title: "تطبيق الدخول",
  description: "واجهة تسجيل الدخول بالعربية",
  verification: {
    google: "YuczLlYL3EL3OL73luFStTsksell36C_52OGnzDQxpE", // ✅ Google site verification tag
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <meta name="google-site-verification" content="YuczLlYL3EL3OL73luFStTsksell36C_52OGnzDQxpE" />
      <body className={`${cairo.variable} font-sans antialiased w-screen h-screen`}>
        <AppProvider>
          {/* Google Identity Services script */}
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="beforeInteractive"
          />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
