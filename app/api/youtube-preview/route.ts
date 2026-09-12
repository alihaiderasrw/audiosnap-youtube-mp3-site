import {NextResponse} from "next/server";

function isYouTubeUrl(value:string){
 try{
  const u=new URL(value);
  const host=u.hostname.replace(/^www\./,"").toLowerCase();
  return host==="youtube.com"||host==="m.youtube.com"||host==="youtu.be";
 }catch{return false}
}

export async function POST(req:Request){
 try{
  const body=await req.json();
  const url=String(body?.url||"").trim();
  if(!url||!isYouTubeUrl(url))return NextResponse.json({error:"Enter a valid YouTube video URL."},{status:400});
  const endpoint=`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const r=await fetch(endpoint,{headers:{Accept:"application/json"},cache:"no-store"});
  if(!r.ok)return NextResponse.json({error:"Could not load this YouTube video. It may be private, unavailable or unsupported."},{status:400});
  const data=await r.json();
  return NextResponse.json({title:data.title,author:data.author_name,thumbnail:data.thumbnail_url,url});
 }catch{
  return NextResponse.json({error:"Could not load the YouTube preview."},{status:500});
 }
}
