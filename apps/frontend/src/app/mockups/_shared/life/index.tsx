// Paper life: arrival, page turns, time-of-day light, seeded imperfection, ageing, reading mode,
// sound and haptics. Mounted once per page by the mockup nav.

import "./life.css";
import { LifeControls, PaperLifeClient } from "./client";

// Runs while the page is still being parsed, before anything paints: a paper that is about to be
// dropped on the desk must not be seen lying there first, and reading mode must not flash the
// tilted page. It only adds a stylesheet — attributes on <html> would disagree with what React
// hydrates — and the client component removes it as soon as it has set the real attributes.
const WRAPS = ".print-sheet-wrap,.yn-sheet-wrap";
const hide = `${WRAPS}{opacity:0;animation:life-failsafe 0s linear 3s forwards}`;
const reading = `${WRAPS}{transform:none!important;width:min(700px,100%)!important}.print-sheet-wrap::after,.yn-sheet-wrap::after{display:none!important}.print-sheet,.yn-sheet{--text:18px!important;filter:none!important}`;
const early = `(function(){try{var q=new URLSearchParams(location.search),css="";
var r=q.get("reading");if(r!=="on"&&r!=="off"){try{r=localStorage.getItem("yn-reading")}catch(e){r=null}}
if(r==="on")css+=${JSON.stringify(reading)};
var p=location.pathname.split("/").filter(Boolean),a=q.get("arrive"),s=null;
var m=p.length===2&&p[0]==="mockups"&&/^v[0-9]+$/.test(p[1])?p[1]:null;
try{s=m&&sessionStorage.getItem("yn-arrived-"+m)}catch(e){}
if(m&&a!=="0"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&(a==="1"||s!=="1"))css+=${JSON.stringify(hide)};
if(!css)return;var el=document.createElement("style");el.id="life-early";el.textContent=css;document.head.appendChild(el);
}catch(e){}})();`;

export function PaperLife({ version }: { version: string }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: early }} />
      <PaperLifeClient version={version} />
    </>
  );
}

export { LifeControls };
