'use client';
import {useEffect,useState} from 'react';
import {loadFx,loadMarkets} from './api';
import {isDemo} from './firebase-client';
import type {FxRates,Market} from './types';
const KEY='ciray_market_v1';
export function useMarket(){const[markets,setMarkets]=useState<Market[]>([]),[fx,setFx]=useState<FxRates|null>(null),[country,setCountryState]=useState(''),[error,setError]=useState('');useEffect(()=>{let active=true;Promise.all([loadMarkets(),loadFx().catch(()=>null)]).then(([data,rates])=>{if(!active)return;setMarkets(data);setFx(rates);const saved=localStorage.getItem(KEY)||'';setCountryState(data.some(m=>m.code===saved)?saved:isDemo()?'US':'')}).catch(e=>{if(active)setError(e instanceof Error?e.message:'Could not load markets')});const sync=()=>setCountryState(localStorage.getItem(KEY)||'');window.addEventListener('ciray-market',sync);return()=>{active=false;window.removeEventListener('ciray-market',sync)}},[]);return{markets,country,market:markets.find(m=>m.code===country),fx,error,setCountry:(value:string)=>{localStorage.setItem(KEY,value);setCountryState(value);window.dispatchEvent(new Event('ciray-market'))}}}
