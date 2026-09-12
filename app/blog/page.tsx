import type {Metadata} from "next";
import Link from "next/link";
export const metadata:Metadata={title:"Audio Conversion Guides & Tips",description:"Practical guides about MP3 quality, WAV, audio conversion, file formats and browser-based media processing.",alternates:{canonical:"/blog"}};
const posts=[
 ["/blog/mp3-vs-wav","MP3 vs WAV: Which Audio Format Should You Choose?","Compare file size, compression, quality and common uses for MP3 and WAV."],
 ["/blog/mp3-bitrate-guide","MP3 Bitrate Guide: 128 vs 192 vs 256 vs 320 kbps","Understand what MP3 bitrate changes and how to choose a sensible setting."],
 ["/blog/video-to-mp3-guide","How to Convert Your Own Video Files to MP3","A simple guide to extracting audio from compatible video files you own or can process."],
 ["/blog/browser-audio-conversion","How Browser-Based Audio Conversion Works","Learn why local browser processing can improve privacy and simplify file conversion."],
 ["/blog/reduce-audio-file-size","How to Reduce Audio File Size","Practical ways to make audio files smaller while balancing compatibility and sound quality."],
 ["/blog/common-audio-formats","Common Audio Formats Explained","A beginner-friendly overview of MP3, WAV, M4A and other common media formats."]
];
export default function Page(){return <main className="legal"><div className="container"><div className="content"><span className="eyebrow">AudioSnap Guides</span><h1>Audio Conversion Blog</h1><p>Clear, practical resources about digital audio, file conversion and choosing the right format for your needs.</p></div><div className="grid blog-grid">{posts.map(([href,title,desc])=><article className="card" key={href}><h2>{title}</h2><p>{desc}</p><Link className="text-link" href={href}>Read guide →</Link></article>)}</div></div></main>}
