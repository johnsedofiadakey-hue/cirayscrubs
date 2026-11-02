import type {StoreColor} from './types';

export const BRAND_COLOR='#512D20';
const fallbackColors:Record<string,string>={forest:'#164b3d',navy:'#1e2633',wine:'#6e2d3a',black:'#252525'};
const STORAGE_KEY='ciray_selected_color_v1';

function rgb(hex:string):[number,number,number]|null{const match=/^#([0-9a-f]{6})$/i.exec(hex);if(!match)return null;const value=match[1];return[0,2,4].map(i=>parseInt(value.slice(i,i+2),16)) as [number,number,number]}
function hex([r,g,b]:number[]){return `#${[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')}`}
function luminance([r,g,b]:number[]){const channel=(v:number)=>{const c=v/255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4};return 0.2126*channel(r)+0.7152*channel(g)+0.0722*channel(b)}
/** Preserve the garment hue, but darken pale shades until white button text is readable. */
export function themeForHex(input:string){const base=rgb(input)||rgb(BRAND_COLOR)!;let accent=base;while((1.05)/(luminance(accent)+0.05)<4.5){accent=accent.map(v=>Math.max(0,Math.floor(v*0.92))) as [number,number,number]}const soft=base.map(v=>Math.round(v*0.11+255*0.89));return{accent:hex(accent),soft:hex(soft),raw:hex(base)}}
export function colorHex(name:string,palette:StoreColor[]){return palette.find(c=>c.name.toLowerCase()===name.toLowerCase())?.hex||fallbackColors[name.toLowerCase()]||BRAND_COLOR}
export function applyProductTheme(name:string,sourceHex:string,persist=true){if(typeof document==='undefined')return;const theme=themeForHex(sourceHex);document.documentElement.style.setProperty('--theme-accent',theme.accent);document.documentElement.style.setProperty('--theme-soft',theme.soft);document.documentElement.style.setProperty('--theme-raw',theme.raw);document.documentElement.dataset.scrubColor=name;if(persist){try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify({name,hex:sourceHex}))}catch{}}}
export function restoreProductTheme(){if(typeof window==='undefined')return;try{const stored=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null') as {name?:string;hex?:string}|null;if(stored?.name&&stored.hex)applyProductTheme(stored.name,stored.hex,false)}catch{}}
