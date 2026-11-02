'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {loadNavigation} from '@/lib/api';
import {demoNavigation} from '@/lib/demo';
import {useMarket} from '@/lib/market';
import {localEstimate} from '@/lib/price';
import type {Navigation} from '@/lib/types';
export function Footer(){const{market,fx}=useMarket(),hasEstimate=!!localEstimate(10000,market,fx),[nav,setNav]=useState<Navigation>(demoNavigation);useEffect(()=>{let live=true;loadNavigation().then(value=>{if(live)setNav(value)}).catch(()=>{});return()=>{live=false}},[]);return <footer className="footer"><div className="footer-inner"><div><img className="footer-logo" src="/brand/ciray-stitch-star-logo.svg" alt="Ciray Scrubs"/><p>{nav.footer.tagline||'Care starts with what you wear.'}</p></div>{nav.footer.columns.map(column=><div key={column.heading}><h3>{column.heading}</h3>{column.links.map(link=><Link key={link.href+link.label} href={link.href}>{link.label}</Link>)}{column.heading.toLowerCase()==='shop'&&!column.links.some(link=>link.href==='/collections/bottles')&&<Link href="/collections/bottles">Bottles</Link>}</div>)}</div><div className="fine">{hasEstimate&&<span>Prices are in US dollars. Local amounts are estimates. </span>}Payment, shipping and market availability are verified country by country. Concept imagery and product facts are not live offers.{nav.footer.legal.length>0&&<span className="footer-legal">{nav.footer.legal.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</span>}</div></footer>}
