import type {MetadataRoute} from "next";
import {site} from "@/lib/site";
export default function sitemap():MetadataRoute.Sitemap{
 const primary=["","/youtube-to-mp3","/youtube-to-wav","/how-it-works","/faq","/blog","/privacy-policy","/terms","/disclaimer","/contact"];
 const guides=["/blog/mp3-vs-wav","/blog/mp3-bitrate-guide","/blog/video-to-mp3-guide","/blog/browser-audio-conversion","/blog/reduce-audio-file-size","/blog/common-audio-formats"];
 return [...primary,...guides].map(p=>({url:`${site.url}${p}`,lastModified:new Date(),changeFrequency:p===""?"weekly":"monthly",priority:p===""?1:p==="/youtube-to-mp3"||p==="/youtube-to-wav"?.9:p.startsWith("/blog/")?.75:.7}));
}
