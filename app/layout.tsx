import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "AudioSnap – Free MP3 & WAV Audio Converter", template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["audio converter","MP3 converter","video to MP3","MP4 to MP3","WAV converter","online audio converter","browser audio converter"],
  robots: { index: true, follow: true },
  openGraph: { type:"website", title:"AudioSnap – Free MP3 & WAV Audio Converter", description:site.description, url:site.url, siteName:site.name },
  twitter: { card:"summary_large_image", title:"AudioSnap – Free MP3 & WAV Audio Converter", description:site.description },
  alternates: { canonical: "/" },
};

export default function RootLayout({children}:{children:React.ReactNode}){
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebSite",name:site.name,url:site.url,description:site.description},{"@type":"WebApplication",name:site.name,url:site.url,applicationCategory:"MultimediaApplication",operatingSystem:"Any",description:site.description,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}}]};
 return <html lang="en"><body><Header/>{children}<Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>;
}
