import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "YouTube to MP3 Converter – Convert YouTube to MP3 Online", template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type:"website", title:"YouTube to MP3 Converter", description:site.description, url:site.url, siteName:site.name },
  twitter: { card:"summary_large_image", title:"YouTube to MP3 Converter", description:site.description },
  alternates: { canonical: "/" },
};

export default function RootLayout({children}:{children:React.ReactNode}){
 const schema={"@context":"https://schema.org","@type":"WebSite",name:site.name,url:site.url,description:site.description};
 return <html lang="en"><body><Header/>{children}<Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>;
}
