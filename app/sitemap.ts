import type {MetadataRoute} from "next";
import {site} from "@/lib/site";
export default function sitemap():MetadataRoute.Sitemap{
 const paths=["","/youtube-to-mp3","/youtube-to-wav","/youtube-downloader","/youtube-audio-converter","/youtube-to-mp3-online","/youtube-to-mp3-mobile","/how-it-works","/faq","/blog","/privacy-policy","/terms","/disclaimer","/contact"];
 return paths.map(p=>({url:`${site.url}${p}`,lastModified:new Date(),changeFrequency:p===""?"weekly":"monthly",priority:p===""?1:p==="/blog"?.8:.7}));
}
