"use client";

import {useState} from "react";

type TestResult={ok?:boolean;mode?:string;message?:string;secretExposedToBrowser?:boolean;error?:string};

export default function ApiTest(){
 const[loading,setLoading]=useState(false);const[result,setResult]=useState<TestResult|null>(null);
 async function runTest(){setLoading(true);setResult(null);try{const r=await fetch("/api/provider-test",{cache:"no-store"});const data=await r.json();setResult(data)}catch{setResult({ok:false,error:"Could not reach the AudioSnap test endpoint."})}finally{setLoading(false)}}
 return <section className="api-test-card" aria-labelledby="api-test-title">
  <div><span className="api-test-kicker">Developer Demo</span><h2 id="api-test-title">Bearer API Connection Test</h2><p>See how AudioSnap can call a server-side API without exposing a secret token in the browser.</p></div>
  <button className="button api-test-button" type="button" onClick={runTest} disabled={loading}>{loading?"Testing connection…":"Run API Test"}</button>
  {result&&<div className={result.ok?"api-test-result success":"api-test-result error"}><strong>{result.ok?"✓ Connection successful":"✕ Test failed"}</strong><p>{result.message||result.error||"No response message was returned."}</p>{result.ok&&<div className="api-test-meta"><span>Mode: {result.mode||"demo"}</span><span>Secret exposed: {result.secretExposedToBrowser?"Yes":"No"}</span></div>}</div>}
 </section>
}
