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
  title: "Aamana Classroom",
  description:
    "منصة أمانة كلاس روم — لتسهيل إدارة الفصول الدراسية، متابعة الطلاب، وتنظيم الاشتراكات بسهولة واحترافية.",
  applicationName: "Aamana Classroom",
  authors: [{ name: "fares mohamed mostafa" }],
  keywords: [
    "Aamana Classroom",
    "منصة تعليمية",
    "إدارة الطلاب",
    "إدارة الفصول الدراسية",
    "نظام اشتراكات",
    "تعليم إلكتروني",
  ],
  metadataBase: new URL("https://aamana-classroom.vercel.app"), // update if hosted elsewhere
  openGraph: {
    title: "Aamana Classroom | منصة أمانة التعليمية",
    description:
      "منصة ذكية لإدارة الفصول الدراسية ومتابعة الطلاب بسهولة وسرعة.",
    url: "https://aamana-classroom.vercel.app",
    siteName: "Aamana Classroom",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "Aamana Classroom Logo",
      },
    ],
    locale: "ar_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aamana Classroom",
    description:
      "منصة أمانة التعليمية — لإدارة الفصول الدراسية ومتابعة الطلاب.",
    images: ["/images/logo.png"],
    creator: "@AamanaClassroom",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  verification: {
    google: "YuczLlYL3EL3OL73luFStTsksell36C_52OGnzDQxpE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google site verification (extra meta for safety) */}
        <meta
          name="google-site-verification"
          content="YuczLlYL3EL3OL73luFStTsksell36C_52OGnzDQxpE"
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href="https://aamana-classroom.vercel.app"
        />

        {/* Favicon */}
        <link rel="icon" href="/images/logo.png" />
      </head>

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
