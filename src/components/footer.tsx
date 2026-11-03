'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {loadNavigation} from '@/lib/api';
import {demoNavigation} from '@/lib/demo';
import {useMarket} from '@/lib/market';
import {localEstimate} from '@/lib/price';
import {isDemo} from '@/lib/firebase-client';
import type {Navigation} from '@/lib/types';

export function Footer(){
 const {market,fx,markets,country,setCountry}=useMarket();
 const hasEstimate=!!localEstimate(10000,market,fx);
 const [nav,setNav]=useState<Navigation>(demoNavigation);
 const [year,setYear]=useState(2026);
 useEffect(()=>{let live=true;loadNavigation().then(value=>{if(live)setNav(value)}).catch(()=>{});return()=>{live=false}},[]);
 useEffect(()=>{queueMicrotask(()=>setYear(new Date().getFullYear()))},[]);
 const shop=nav.footer.columns.find(column=>column.heading.toLowerCase()==='shop');
 const help=nav.footer.columns.find(column=>column.heading.toLowerCase()==='help');
 const about=nav.footer.columns.find(column=>column.heading.toLowerCase()==='about');
 const guides=about?.links.filter(link=>['/pages/fabric','/pages/personalise'].includes(link.href))||[];
 const aboutLinks=about?.links.filter(link=>!guides.some(guide=>guide.href===link.href))||[];
 const shopLinks=shop?.links.some(link=>link.href==='/collections/bottles')?shop.links:[...(shop?.links||[]),{label:'Bottles',href:'/collections/bottles'}];
 return <footer className="footer">
  <div className="footer-inner">
   <div className="footer-brand"><img className="footer-logo" src="/brand/ciray-stitch-star-logo.svg" alt="Ciray Scrubs"/><h2>For the ones who care.</h2><p>{nav.footer.tagline||'Care starts with what you wear.'}</p>{nav.footer.social.length>0&&<div className="footer-social" aria-label="Ciray social media">{nav.footer.social.map(link=><a key={link.network} href={link.href} target="_blank" rel="noopener noreferrer">{link.network}</a>)}</div>}</div>
   <div className="footer-column"><h3>Shop</h3>{shopLinks.map(link=><Link key={link.href+link.label} href={link.href}>{link.label}</Link>)}</div>
   <div className="footer-column"><h3>Help</h3>{(help?.links||[]).map(link=><Link key={link.href+link.label} href={link.href}>{link.label}</Link>)}</div>
   <div className="footer-column"><h3>About</h3>{aboutLinks.map(link=><Link key={link.href+link.label} href={link.href}>{link.label}</Link>)}</div>
   <div className="footer-column"><h3>Guides</h3>{guides.map(link=><Link key={link.href+link.label} href={link.href}>{link.label}</Link>)}</div>
  </div>
  <div className="footer-bottom"><div><p>© {year} Ciray Scrubs LLC</p>{nav.footer.legal.length>0&&<div className="footer-legal">{nav.footer.legal.map(link=><Link key={link.href+link.label} href={link.href}>{link.label}</Link>)}</div>}</div><label className="footer-country"><span>Shopping from</span><select value={country} onChange={event=>setCountry(event.target.value)} aria-label="Shipping country"><option value="">Choose country</option>{markets.map(item=><option value={item.code} key={item.code}>{item.code} · {item.displayCurrency.toUpperCase()}</option>)}</select></label></div>
  <p className="footer-disclosure">{hasEstimate&&'Local currency amounts are estimates. '}Payment, shipping and market availability are verified country by country. {isDemo()&&'Concept imagery and product facts are not live offers.'}</p>
 </footer>
}
