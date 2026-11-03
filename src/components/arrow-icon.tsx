export function ArrowIcon({direction='up-right'}:{direction?:'up-right'|'right'|'left'}){
 const path=direction==='right'?'M4 12h16m-7-7 7 7-7 7':direction==='left'?'M20 12H4m7-7-7 7 7 7':'M5 19 19 5M7 5h12v12';
 return <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={path}/></svg>;
}
