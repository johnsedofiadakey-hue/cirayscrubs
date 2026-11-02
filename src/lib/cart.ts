'use client';
import {useEffect,useState} from 'react';
import type {CartLine} from './types';
const KEY='ciray_cart_v1';
export function readCart():CartLine[]{if(typeof window==='undefined')return[];try{const value=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
function writeCart(lines:CartLine[]){localStorage.setItem(KEY,JSON.stringify(lines));window.dispatchEvent(new Event('ciray-cart'))}
export function useCart(){const[lines,setLines]=useState<CartLine[]>([]);useEffect(()=>{const sync=()=>setLines(readCart());sync();window.addEventListener('ciray-cart',sync);return()=>window.removeEventListener('ciray-cart',sync)},[]);return{lines,add:(line:CartLine)=>{const current=readCart(),match=current.findIndex(x=>JSON.stringify({...x,quantity:1})===JSON.stringify({...line,quantity:1}));if(match>=0)current[match].quantity+=line.quantity;else current.push(line);writeCart(current)},change:(index:number,quantity:number)=>{const current=readCart();if(!current[index])return;if(quantity<=0)current.splice(index,1);else current[index].quantity=quantity;writeCart(current)},clear:()=>writeCart([])}}
