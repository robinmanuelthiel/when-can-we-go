"use strict";
/* ============================================================
   When Can We Go? — shared config + helpers
   Loaded by both the landing page (index.html) and the planner
   page (trip.html) so the Firebase config and date helpers live
   in exactly one place and can never drift between the two.
   ============================================================ */

/* ▼▼▼  PASTE YOUR firebaseConfig OBJECT HERE  ▼▼▼
   Firebase console → ⚙ Project settings → General → Your apps →
   Web app (</>) → copy the firebaseConfig snippet. The databaseURL
   line is required (Build → Realtime Database gives you that URL). */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDkO2vGr2w3PUqIdE0nFO4Byaib_R_6vy8",
  authDomain: "when-can-we-go.firebaseapp.com",
  databaseURL: "https://when-can-we-go-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "when-can-we-go",
  storageBucket: "when-can-we-go.firebasestorage.app",
  messagingSenderId: "755985092176",
  appId: "1:755985092176:web:4d5153219cb88e3cbe0b55",
  measurementId: "G-5WKC5X97G0"
};
/* ▲▲▲  nothing else to configure  ▲▲▲ */
const FB_SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const PALETTE = ["#E0524A","#2A9D8F","#E9A23B","#5B7FE0","#9B5BE0","#E05B9B","#3BA55C","#C9772F","#4A78D4","#B0457B"];
const DOW = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ---------- date helpers (timezone-safe, local) ---------- */
const pad = n => String(n).padStart(2,"0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseYmd = s => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); };
const addDays = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
const mondayIdx = d => (d.getDay()+6)%7;            // Mon=0 … Sun=6
const fmtShort = d => `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`;
const fmtFull = d => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
function fmtRange(a,b){
  if(a.getTime()===b.getTime()) return fmtFull(a);
  if(a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth())
    return `${a.getDate()} – ${b.getDate()} ${MONTHS[a.getMonth()]} ${a.getFullYear()}`;
  if(a.getFullYear()===b.getFullYear())
    return `${fmtShort(a)} – ${fmtFull(b)}`;
  return `${fmtFull(a)} – ${fmtFull(b)}`;
}
const uid = () => Math.random().toString(36).slice(2,9)+Math.random().toString(36).slice(2,6);
const genRoomId = () => uid()+uid()+uid();   // ~unguessable room key for the share link

/* ---------- Firebase backend (shared db/FB handles) ---------- */
let db=null, FB=null;
function firebaseConfigured(){
  const c=FIREBASE_CONFIG;
  return !!(c && c.databaseURL && c.apiKey && !/PASTE_|YOUR_/.test(c.databaseURL+c.apiKey));
}
async function backendInit(){
  if(!firebaseConfigured()) return false;
  try{
    // dynamic import so a failed load (e.g. offline) never blocks the app
    const appMod = await import(`${FB_SDK}/firebase-app.js`);
    FB = await import(`${FB_SDK}/firebase-database.js`);
    const app = appMod.initializeApp(FIREBASE_CONFIG);
    db = FB.getDatabase(app);
    return true;
  }catch(e){ console.warn("Firebase unavailable — running local-only.",e); db=null; return false; }
}

/* ---------- misc helpers ---------- */
function escapeHtml(s){ return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

/* default trip window: this month through the end of +3 months (4-month span) */
function defaultData(){
  const now=Date.now();
  const s=new Date(); s.setDate(1);
  const e=new Date(s.getFullYear(), s.getMonth()+4, 0); // last day of +3 months → 4 month span
  return { v:1, trip:{ title:"Our Trip", start:ymd(s), end:ymd(e), updatedAt:now }, people:{} };
}
