import Link from "next/link";
import {site} from "@/lib/site";

export default function Header(){
 return <header className="site-header"><div className="container nav-wrap">
  <Link className="brand" href="/">{site.name}</Link>
  <nav className="nav-links">
   <Link href="/youtube-to-mp3">MP3 Converter</Link>
   <Link href="/youtube-to-wav">WAV Converter</Link>
   <Link href="/how-it-works">How It Works</Link>
   <Link href="/blog">Blog</Link>
   <Link href="/faq">FAQ</Link>
  </nav>
  <Link className="button small" href="/#converter">Start Converting</Link>
 </div></header>
}
