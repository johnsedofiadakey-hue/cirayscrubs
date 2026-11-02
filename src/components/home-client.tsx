'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {imageUrl,loadCatalogBundle,loadCollection,loadColors,loadContent} from '@/lib/api';
import {collectionMembers,sortProducts} from '@/lib/merchandising';
import {useMarket} from '@/lib/market';
import type {CatalogBundle,CatalogEntry,FxRates,HomeContent,HomeSection,Market,StoreColor} from '@/lib/types';
import {ProductCard} from './product-card';
import {StoreLayout} from './store-layout';

type Media={src:string;alt:string};type Cta={label:string;href:string};
type Rail=HomeSection&{heading:string;source:{kind:'filter'|'handles'|'collection'|'personalized';handles?:string[];collectionId?:string;fallbackCollectionId?:string;department?:string;productType?:string;sort?:string;limit?:number};cta?:Cta};
function ProductRail({section,bundle,market,fx}:{section:Rail;bundle:CatalogBundle;market?:Market;fx:FxRates|null}){
  const[products,setProducts]=useState<CatalogEntry[]>([]);
  useEffect(()=>{let live=true;const source=section.source;const task=async()=>{
    if(source.kind==='handles')return source.handles?.map(h=>bundle.entries.find(e=>e.handle===h)).filter((e):e is CatalogEntry=>!!e)||[];
    if(source.kind==='filter')return sortProducts(bundle.entries.filter(e=>(!source.department||e.department===source.department)&&(!source.productType||e.productType===source.productType)),source.sort||'featured',bundle);
    const handle=source.kind==='collection'?source.collectionId:source.fallbackCollectionId;
    const collection=handle?await loadCollection(handle):null;const fallback=collection?sortProducts(collectionMembers(collection,bundle),collection.defaultSort,bundle,collection.source.kind==='manual'?collection.source.handles:undefined):[];
    if(source.kind!=='personalized')return fallback;
    try{const recent=JSON.parse(localStorage.getItem('ciray_recent_v1')||'[]') as string[];const picks=recent.map(h=>bundle.entries.find(e=>e.handle===h)).filter((e):e is CatalogEntry=>!!e);return [...picks,...fallback.filter(e=>!picks.some(p=>p.handle===e.handle))]}catch{return fallback}
  };void task().then(result=>{if(live)setProducts(result.slice(0,source.limit||12))}).catch(()=>{if(live)setProducts([])});return()=>{live=false}},[section,bundle]);
  if(!products.length)return null;
  return <section className="section-pad featured-section"><div className="section-head"><div><span className="eyebrow">Everyday essentials</span><h2 className="section-title">{section.heading}</h2></div>{section.cta&&<Link className="text-arrow" href={section.cta.href}>{section.cta.label} →</Link>}</div><div className="product-grid">{products.map(p=><ProductCard item={p} bundle={bundle} market={market} fx={fx} key={p.handle}/>)}</div></section>
}
function ColorList({section,colors}:{section:HomeSection;colors:StoreColor[]}){
 const rail=useRef<HTMLDivElement>(null);
 const [canScroll,setCanScroll]=useState({left:false,right:false});
 const s=section as HomeSection&{style:'swatches'|'marquee';heading?:string;body?:string;group?:string;hrefTemplate:string;limit:number;cta?:Cta};
 const shown=colors.filter(c=>!s.group||c.group===s.group).slice(0,s.limit);
 useEffect(()=>{
  const el=rail.current;if(!el)return;
  const update=()=>setCanScroll({left:el.scrollLeft>2,right:el.scrollLeft+el.clientWidth<el.scrollWidth-2});
  update();el.addEventListener('scroll',update,{passive:true});
  const resize=new ResizeObserver(update);resize.observe(el);
  return()=>{el.removeEventListener('scroll',update);resize.disconnect()};
 },[shown.length]);
 if(!shown.length)return null;
 return <section className="color-section section-pad" aria-label="Shop by colour">
  <div className="color-section-top"><div><span className="eyebrow">The Ciray palette</span><h2 className="section-title">{s.heading||'Find your shade'}</h2>{s.body&&<p>{s.body}</p>}</div>
   {(s.cta||canScroll.left||canScroll.right)&&<div className="color-controls">{s.cta&&<Link className="text-arrow" href={s.cta.href}>{s.cta.label} →</Link>}{(canScroll.left||canScroll.right)&&<><button type="button" aria-label="Scroll colours left" disabled={!canScroll.left} onClick={()=>rail.current?.scrollBy({left:-340,behavior:'smooth'})}>←</button><button type="button" aria-label="Scroll colours right" disabled={!canScroll.right} onClick={()=>rail.current?.scrollBy({left:340,behavior:'smooth'})}>→</button></>}</div>}
  </div>
  <div ref={rail} className={`color-list ${s.style}`}>{shown.map(c=><Link key={c.id} href={s.hrefTemplate.replace('{color}',encodeURIComponent(c.id))} aria-label={`Shop ${c.name} scrubs`}><span className="color-disc" style={{backgroundColor:c.hex||'#d7d9d4'}} aria-hidden="true"><span className="color-disc-mark">✦</span></span><strong>{c.name}</strong><span className="color-card-action" aria-hidden="true">Shop colour ↗</span></Link>)}</div>
 </section>
}
function Section({section,bundle,colors,market,fx}:{section:HomeSection;bundle:CatalogBundle;colors:StoreColor[];market?:Market;fx:FxRates|null}){
 if(section.type==='hero'){
  const s=section as HomeSection&{layout?:string;eyebrow?:string;heading:string;body?:string;image:Media;mobileImage?:Media;collage?:Media[];ctas?:Cta[]};
  if(s.layout==='editorial')return <section className="hero hero-editorial" aria-label="Campaign"><div className="hero-collage" aria-hidden="true">{s.collage?.map((item,i)=><img key={i} src={imageUrl(item.src)} alt=""/>)}</div><div className="hero-feature"><picture>{s.mobileImage&&<source media="(max-width:760px)" srcSet={imageUrl(s.mobileImage.src)}/>}<img src={imageUrl(s.image.src)} alt={s.image.alt}/></picture><div className="hero-copy">{s.eyebrow&&<p className="eyebrow">{s.eyebrow}</p>}<h1>{s.heading}</h1>{s.body&&<p>{s.body}</p>}<div className="hero-actions">{s.ctas?.map((c,i)=><Link className="btn btn-white" href={c.href} key={i}>{c.label}</Link>)}</div></div></div></section>;
  return <section className="hero" aria-label="Campaign"><picture>{s.mobileImage&&<source media="(max-width:760px)" srcSet={imageUrl(s.mobileImage.src)}/>}<img src={imageUrl(s.image.src)} alt={s.image.alt}/></picture><div className="hero-copy">{s.eyebrow&&<p className="eyebrow">{s.eyebrow}</p>}<h1>{s.heading}</h1>{s.body&&<p>{s.body}</p>}<div className="hero-actions">{s.ctas?.map((c,i)=><Link className={`btn ${i===0?'btn-dark':'btn-white'}`} href={c.href} key={i}>{c.label}</Link>)}</div></div></section>;
 }
 if(section.type==='categoryTiles'){const s=section as HomeSection&{heading?:string;tiles:{label:string;image:Media;href:string}[]};return <section className="section-pad" id="categories"><div className="section-head"><div><span className="eyebrow">Find your uniform</span><h2 className="section-title">{s.heading||'Shop by category'}</h2></div></div><div className={`category-grid ${s.tiles.length===4?'category-grid-four':''}`}>{s.tiles.map((tile,i)=><Link href={tile.href} className="category-card" key={i}><img src={imageUrl(tile.image.src)} alt={tile.image.alt} loading="lazy"/><span className="category-label">{tile.label}<span aria-hidden="true">↗</span></span></Link>)}</div></section>}
 if(section.type==='productRail')return <ProductRail section={section as Rail} bundle={bundle} market={market} fx={fx}/>;
 if(section.type==='colorList')return <ColorList section={section} colors={colors}/>;
 if(section.type==='split'){const s=section as HomeSection&{eyebrow?:string;heading:string;body:string;image:Media;imageSide?:'left'|'right';cta?:Cta};return <section className={`split-block ${s.imageSide==='right'?'image-right':''}`}><img className="split-image" src={imageUrl(s.image.src)} alt={s.image.alt} loading="lazy"/><div className="split-copy"><span className="eyebrow">{s.eyebrow||'For teams who care'}</span><h2>{s.heading}</h2><p>{s.body}</p>{s.cta&&<Link className="btn btn-dark" href={s.cta.href}>{s.cta.label}</Link>}</div></section>}
 if(section.type==='banner'){const s=section as HomeSection&{text:string;link?:Cta};return <section className="brand-band"><h2>{s.text}</h2>{s.link&&<Link className="btn btn-outline" href={s.link.href}>{s.link.label}</Link>}</section>}
 if(section.type==='richText'){const s=section as HomeSection&{heading?:string;paragraphs:string[]};return <section className="brand-band">{s.heading&&<h2>{s.heading}</h2>}{s.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</section>}
 return null;
}
const empty:CatalogBundle={entries:[],colorGroups:{},bestSellers:[]};
export function HomeClient({pageId='home'}:{pageId?:string}){const{market,fx}=useMarket();const mainRef=useRef<HTMLElement>(null);const[content,setContent]=useState<HomeContent|null>(null),[bundle,setBundle]=useState<CatalogBundle>(empty),[colors,setColors]=useState<StoreColor[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');useEffect(()=>{let live=true;Promise.all([loadContent(pageId),loadCatalogBundle(),loadColors().catch(()=>[])]).then(([page,catalog,palette])=>{if(live){setContent(page);setBundle(catalog);setColors(palette);setLoading(false)}}).catch(e=>{if(live){setError(e instanceof Error?e.message:'Could not load content');setLoading(false)}});return()=>{live=false}},[pageId]);useEffect(()=>{if(pageId!=='home'||!content||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const sections=mainRef.current?.querySelectorAll<HTMLElement>('.category-grid, .featured-section, .split-block');if(!sections?.length||!('IntersectionObserver'in window))return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px 60px 0px'});sections.forEach(section=>{section.classList.add('home-reveal');observer.observe(section)});return()=>observer.disconnect()},[content,pageId]);return <StoreLayout><main ref={mainRef} className={`main ${pageId==='home'?'home-page':''}`}>{loading?<div className="page-wrap loading-page">Loading Ciray…</div>:error?<div className="page-wrap result-empty">{error}</div>:!content?<div className="page-wrap result-empty"><h1>Page unavailable</h1><Link href="/shop" className="btn btn-dark">Shop all styles</Link></div>:<>{pageId!=='home'&&<div className="page-wrap"><div className="crumb"><Link href="/">Home</Link> / {content.title}</div><div className="page-heading"><span className="eyebrow">Ciray</span><h1>{content.title}</h1></div></div>}{content.sections.map((section,i)=><Section section={section} bundle={bundle} colors={colors} market={market} fx={fx} key={i}/>)}</>}</main></StoreLayout>}
