'use client';
import {ArrowIcon} from './arrow-icon';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {isDemo} from '@/lib/firebase-client';
import {loadCatalog} from '@/lib/api';
import {useMarket} from '@/lib/market';
import type {CatalogEntry} from '@/lib/types';
import {ProductCard} from './product-card';
import {StoreLayout} from './store-layout';

const gallery=[
 {src:'/images/bottles/ciray-bottles-insulated.jpeg',alt:'Client-supplied image of Ciray bottle concepts on a dark set'},
 {src:'/images/bottles/ciray-daily-hydration-blue.jpeg',alt:'Client-supplied image of a blue Ciray bottle concept'},
 {src:'/images/bottles/ciray-glass-bottle-straw.jpeg',alt:'Client-supplied image of a clear Ciray bottle concept'}
];

export function BottlesClient(){
 const {market,fx}=useMarket();
 const [products,setProducts]=useState<CatalogEntry[]|null>(null);
 const [error,setError]=useState('');
 useEffect(()=>{let live=true;loadCatalog().then(entries=>{if(live)setProducts(entries.filter(entry=>entry.productType.toLowerCase()==='bottle'))}).catch(e=>{if(live)setError(e instanceof Error?e.message:'Could not load bottles')});return()=>{live=false}},[]);
 return <StoreLayout><main className="bottles-page">
  <div className="page-wrap"><div className="crumb"><Link href="/">Home</Link> / Bottles</div></div>
  <section className="bottle-hero"><div className="bottle-hero-copy"><span className="eyebrow">Beyond the uniform</span><h1>Carry care forward.</h1><p>Meet the Ciray bottle collection, made to be part of your everyday routine.</p><a className="btn btn-dark" href="#bottle-shop">Explore bottles</a></div><div className="bottle-hero-photo"><img src="/images/bottles/ciray-bottles-collection.jpeg" alt="Client-supplied image of Ciray bottle concepts in several colours"/></div></section>
  <section className="bottle-gallery section-pad" aria-label="Ciray bottle gallery"><div className="section-head"><div><span className="eyebrow">The collection</span><h2 className="section-title">A closer look</h2></div></div><div className="bottle-gallery-grid">{gallery.map((item,i)=><figure key={item.src}><img src={item.src} alt={item.alt} loading="lazy"/><figcaption>0{i+1} / Ciray bottles</figcaption></figure>)}</div></section>
  <section className="bottle-shop section-pad" id="bottle-shop"><div className="section-head"><div><span className="eyebrow">Shop Ciray</span><h2 className="section-title">Bottles</h2></div></div>{error?<p className="form-error" role="alert">{error}</p>:products===null?<p>Loading bottles…</p>:products.length?<div className="product-grid">{products.map(item=><ProductCard key={item.handle} item={item} market={market} fx={fx}/>)}</div>:<div className="bottle-catalog-pending"><p>{isDemo()?'The preview is ready for the bottle catalogue. Confirmed styles, prices and stock can be added in the admin portal.':'Bottle styles are being added. Please check back soon.'}</p><Link className="text-arrow" href="/shop">Shop scrubs <ArrowIcon direction="right"/></Link></div>}</section>
 </main></StoreLayout>
}
