'use client';
import {ArrowIcon} from './arrow-icon';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {imageUrl,loadCatalog} from '@/lib/api';
import {money,type CatalogEntry} from '@/lib/types';

export function SearchIcon(){return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>}

export function SearchDialog({onClose}:{onClose:()=>void}){
 const router=useRouter();
 const input=useRef<HTMLInputElement>(null);
 const [query,setQuery]=useState('');
 const [catalog,setCatalog]=useState<CatalogEntry[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{let live=true;queueMicrotask(()=>input.current?.focus());loadCatalog().then(items=>{if(live)setCatalog(items)}).catch(()=>{if(live)setError('Search is unavailable right now. You can still browse the shop.')}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[]);
 const term=query.trim();
 const matches=term?catalog.filter(item=>`${item.title} ${item.productType} ${item.colors.join(' ')} ${item.tokens.join(' ')}`.toLowerCase().includes(term.toLowerCase())).slice(0,5):[];
 function seeAll(event?:FormEvent<HTMLFormElement>){event?.preventDefault();if(!term)return;onClose();router.push(`/shop?q=${encodeURIComponent(term)}`)}
 return <div className="search-overlay"><button className="search-scrim" type="button" aria-label="Close search" onClick={onClose}/><section className="search-dialog" role="dialog" aria-modal="true" aria-label="Search products" onKeyDown={event=>{if(event.key==='Escape')onClose()}}>
  <div className="search-dialog-head"><span className="eyebrow">Find your next shift essential</span><button type="button" className="search-close" onClick={onClose} aria-label="Close search">×</button></div>
  <form onSubmit={seeAll}><SearchIcon/><input ref={input} type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search products" aria-label="Search the Ciray catalogue"/><button type="submit" disabled={!term}>Search</button></form>
  {error&&<p className="search-note" role="alert">{error}</p>}
  {term?<div className="search-results" aria-live="polite">{loading?<p className="search-note">Searching…</p>:matches.length?matches.map(item=><Link key={item.handle} href={`/product/${item.handle}`} onClick={onClose}><span className="search-result-photo">{item.image&&<img src={imageUrl(item.image.url)} alt=""/>}</span><span><strong>{item.title}</strong><small>{item.productType==='bottle'?'Bottles':item.department==='mens'?'Men':'Women'} · {item.colors.slice(0,2).join(', ')}</small></span><span>{money(item.priceMinCents)}</span></Link>):!error&&<p className="search-note">No matching products. Try another style or colour.</p>}<button className="search-view-all" type="button" onClick={()=>seeAll()}>View all results <ArrowIcon direction="right"/></button></div>:<div className="search-suggestions"><span className="eyebrow">Popular paths</span><Link href="/shop?department=womens" onClick={onClose}>Women’s scrubs <ArrowIcon/></Link><Link href="/shop?department=mens" onClick={onClose}>Men’s scrubs <ArrowIcon/></Link><Link href="/collections/bottles" onClick={onClose}>Bottles <ArrowIcon/></Link></div>}
 </section></div>
}
