"use client";
import {useRef,useState} from "react";
import type {FFmpeg as FFmpegType} from "@ffmpeg/ffmpeg";

const MAX_FILE_SIZE=200*1024*1024;
const MEDIA_EXT=/\.(mp4|webm|mov|m4v|mp3|m4a|aac|wav|ogg|oga|flac)(?:$|[?#])/i;

export default function Converter({format="mp3"}:{format?:"mp3"|"wav"}){
 const[quality,setQuality]=useState("192");
 const[message,setMessage]=useState("");
 const[loading,setLoading]=useState(false);
 const[file,setFile]=useState<File|null>(null);
 const[url,setUrl]=useState("");
 const[progress,setProgress]=useState(0);
 const[downloadUrl,setDownloadUrl]=useState("");
 const[downloadName,setDownloadName]=useState("audiosnap-audio");
 const fileRef=useRef<HTMLInputElement>(null);
 const ffmpegRef=useRef<FFmpegType|null>(null);

 function clearDownload(){if(downloadUrl)URL.revokeObjectURL(downloadUrl);setDownloadUrl("")}

 async function getFFmpeg(){
  const [{FFmpeg},{toBlobURL}]=await Promise.all([import("@ffmpeg/ffmpeg"),import("@ffmpeg/util")]);
  let ffmpeg=ffmpegRef.current;
  if(!ffmpeg){
   ffmpeg=new FFmpeg();
   ffmpeg.on("progress",({progress})=>setProgress(Math.max(0,Math.min(100,Math.round(progress*100)))));
   const base="https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
   await ffmpeg.load({coreURL:await toBlobURL(`${base}/ffmpeg-core.js`,"text/javascript"),wasmURL:await toBlobURL(`${base}/ffmpeg-core.wasm`,"application/wasm")});
   ffmpegRef.current=ffmpeg;
  }
  return ffmpeg;
 }

 async function convertSource(source:File,name:string){
  setLoading(true);setProgress(0);clearDownload();
  try{
   if(source.size>MAX_FILE_SIZE)throw new Error("File is too large. Please use a file under 200 MB.");
   setMessage("Loading secure browser converter…");
   const [{fetchFile},ffmpeg]=await Promise.all([import("@ffmpeg/util"),getFFmpeg()]);
   setMessage("Converting on your device…");
   const ext=source.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g,"")||"media";
   const input=`input.${ext}`;
   const output=format==="wav"?"audiosnap-output.wav":"audiosnap-output.mp3";
   await ffmpeg.writeFile(input,await fetchFile(source));
   const args=format==="wav"?["-i",input,"-vn","-c:a","pcm_s16le",output]:["-i",input,"-vn","-c:a","libmp3lame","-b:a",`${quality}k`,output];
   await ffmpeg.exec(args);
   const data=await ffmpeg.readFile(output);
   const bytes=data instanceof Uint8Array?data:new TextEncoder().encode(data);
   const blob=new Blob([bytes as BlobPart],{type:format==="wav"?"audio/wav":"audio/mpeg"});
   setDownloadUrl(URL.createObjectURL(blob));
   setDownloadName(name.replace(/\.[^.]+$/,"").replace(/[^a-zA-Z0-9-_ ]/g,"").trim()||"audiosnap-audio");
   setProgress(100);setMessage("Conversion complete. Your download is ready.");
   await ffmpeg.deleteFile(input);await ffmpeg.deleteFile(output);
  }catch(e:any){console.error(e);setMessage(e?.message||"Conversion could not be completed. Try another supported media file.")}
  finally{setLoading(false)}
 }

 async function convertLocal(){if(!file){fileRef.current?.click();return}await convertSource(file,file.name)}

 async function convertUrl(e:React.FormEvent){
  e.preventDefault();setMessage("");setProgress(0);clearDownload();
  let parsed:URL;
  try{parsed=new URL(url)}catch{setMessage("Please enter a valid direct media URL starting with http:// or https://.");return}
  if(!["http:","https:"].includes(parsed.protocol)){setMessage("Only http:// and https:// media URLs are supported.");return}
  setLoading(true);
  try{
   setMessage("Fetching media from the URL…");
   const r=await fetch(parsed.toString(),{method:"GET",mode:"cors",credentials:"omit",redirect:"follow"});
   if(!r.ok)throw new Error(`The media server returned HTTP ${r.status}.`);
   const type=(r.headers.get("content-type")||"").toLowerCase();
   if(!type.startsWith("audio/")&&!type.startsWith("video/")&&!MEDIA_EXT.test(parsed.pathname))throw new Error("This URL does not appear to point directly to an audio or video file.");
   const len=Number(r.headers.get("content-length")||0);
   if(len>MAX_FILE_SIZE)throw new Error("The remote file is larger than 200 MB.");
   const blob=await r.blob();
   if(blob.size>MAX_FILE_SIZE)throw new Error("The remote file is larger than 200 MB.");
   const pathName=decodeURIComponent(parsed.pathname.split("/").pop()||"remote-media");
   const ext=(pathName.match(/\.([a-zA-Z0-9]{2,5})$/)?.[1]||type.split("/")[1]?.split(";")[0]||"media").replace(/[^a-zA-Z0-9]/g,"");
   const remoteFile=new File([blob],pathName.includes(".")?pathName:`remote-media.${ext}`,{type:type||blob.type});
   setLoading(false);
   await convertSource(remoteFile,remoteFile.name);
  }catch(e:any){
   console.error(e);
   setLoading(false);
   const corsHint=e instanceof TypeError?" The source may block browser access (CORS). Try another direct media URL or upload the file below.":"";
   setMessage((e?.message||"Could not fetch this media URL.")+corsHint);
  }
 }

 return <div id="converter" className="converter-card">
  <form onSubmit={convertUrl} className="url-converter">
   <div className="status-row"><strong>Convert from a media URL</strong><span className="live-badge">Available</span></div>
   <p>Paste a direct link to an audio or video file you own or have permission to process, such as an MP4, WebM, M4A, WAV or MP3 file.</p>
   <label htmlFor="media-url">Direct media URL</label>
   <div className="input-row"><input id="media-url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/my-video.mp4" type="url" required disabled={loading}/></div>
   {format==="mp3"&&<div className="local-quality"><label>MP3 quality</label><select value={quality} onChange={e=>setQuality(e.target.value)} disabled={loading}><option value="128">128 kbps</option><option value="192">192 kbps</option><option value="256">256 kbps</option><option value="320">320 kbps</option></select></div>}
   <button type="submit" className="button wide" disabled={loading||!url.trim()}>{loading?`Processing… ${progress}%`:`Convert URL to ${format.toUpperCase()}`}</button>
  </form>
  <div className="divider"><span>OR UPLOAD A FILE</span></div>
  <div className="local-converter"><h3>Convert your own file</h3><p>Choose a video or audio file from your device. Processing happens locally in your browser.</p>{format==="mp3"&&<div className="local-quality"><label>MP3 quality</label><select value={quality} onChange={e=>setQuality(e.target.value)} disabled={loading}><option value="128">128 kbps</option><option value="192">192 kbps</option><option value="256">256 kbps</option><option value="320">320 kbps</option></select></div>}<input ref={fileRef} className="file-input" type="file" accept="audio/*,video/*" onChange={e=>{const f=e.target.files?.[0]||null;setFile(f);setProgress(0);setMessage(f?`Selected: ${f.name}`:"");clearDownload()}}/><button type="button" className="ghost wide-ghost" disabled={loading} onClick={()=>fileRef.current?.click()}>{file?`Change file: ${file.name}`:"Choose audio/video file"}</button>{file&&<button type="button" className="button wide" disabled={loading} onClick={convertLocal}>{loading?`Converting… ${progress}%`:`Convert file to ${format.toUpperCase()}`}</button>}</div>
  {loading&&<div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div>}
  {downloadUrl&&<a className="download-button" href={downloadUrl} download={`${downloadName}.${format}`}>Download {format.toUpperCase()}</a>}
  {message&&<div className="alert">{message}</div>}
  <p className="notice">Use this tool only with media you own or are authorized to convert. Some remote servers block browser fetching, so direct URL conversion may depend on the source allowing cross-origin access.</p>
 </div>
}
