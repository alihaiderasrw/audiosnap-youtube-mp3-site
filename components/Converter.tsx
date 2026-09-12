"use client";
import {useRef,useState} from "react";

export default function Converter({format="mp3"}:{format?:"mp3"|"wav"}){
 const[url,setUrl]=useState(""); const[quality,setQuality]=useState("192"); const[message,setMessage]=useState(""); const[loading,setLoading]=useState(false); const[file,setFile]=useState<File|null>(null); const fileRef=useRef<HTMLInputElement>(null);
 async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setMessage("");try{const r=await fetch("/api/convert",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({url,format,quality})});const d=await r.json();if(!r.ok)throw new Error(d.message||"Conversion provider is not configured yet.");setMessage(d.downloadUrl?`Ready: ${d.downloadUrl}`:"Conversion completed.")}catch(e:any){setMessage(e.message)}finally{setLoading(false)}}
 function useLocalFile(){if(!file){fileRef.current?.click();return}setMessage(`Selected: ${file.name}. Secure local MP3 encoding is the next processing module; your file has not been uploaded.`)}
 return <div id="converter" className="converter-card">
  <form onSubmit={submit}><label>YouTube URL</label><div className="input-row"><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required/></div><div className="options"><div><label>Audio quality</label><select value={quality} onChange={e=>setQuality(e.target.value)}><option value="128">128 kbps</option><option value="192">192 kbps</option><option value="256">256 kbps</option><option value="320">320 kbps</option></select></div><div className="format-pill">{format.toUpperCase()}</div></div><button className="button wide" disabled={loading}>{loading?"Processing…":`Convert to ${format.toUpperCase()}`}</button></form>
  <div className="divider"><span>OR</span></div>
  <div className="local-converter"><h3>Convert your own file</h3><p>Choose a video or audio file you own or have permission to convert. Your file stays on your device while you select it.</p><input ref={fileRef} className="file-input" type="file" accept="audio/*,video/*" onChange={e=>{const f=e.target.files?.[0]||null;setFile(f);setMessage(f?`Selected: ${f.name}`:"")}}/><button type="button" className="ghost wide-ghost" onClick={useLocalFile}>{file?`Selected: ${file.name}`:"Choose audio/video file"}</button></div>
  {message&&<div className="alert">{message}</div>}<p className="notice">Use this tool only with content you own or are authorized to download or convert.</p>
 </div>
}
