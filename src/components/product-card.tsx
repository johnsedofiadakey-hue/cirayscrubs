import Link from 'next/link';
import {imageUrl} from '@/lib/api';
import {money,type CatalogEntry,type FxRates,type Market} from '@/lib/types';
import {productBadge} from '@/lib/merchandising';
import {localEstimate} from '@/lib/price';
import type {CatalogBundle} from '@/lib/types';
export function ProductCard({item,bundle,market,fx}:{item:CatalogEntry;bundle?:CatalogBundle;market?:Market;fx?:FxRates|null}){const badge=productBadge(item,bundle),estimate=localEstimate(item.priceMinCents,market,fx||null);return <Link className="product-card" href={`/product/${encodeURIComponent(item.handle)}`}><div className="product-card-img">{item.image?<img src={imageUrl(item.image.url)} alt={item.image.alt} loading="lazy"/>:<div className="no-image">Photo pending</div>}{badge?<span className="tag">{badge}</span>:item.onSale&&<span className="tag">Sale</span>}</div><h3>{item.title}</h3><p className="price">{money(item.priceMinCents)}</p>{estimate&&<p className="price-estimate">{estimate}</p>}<p className="meta">{item.colors.slice(0,2).join(' · ')} · {item.department}</p><div className="mini-swatches" aria-label={`${item.colors.length} colors`}>{item.colors.slice(0,4).map(c=><i key={c} style={{backgroundColor:({Forest:'#164b3d',Wine:'#6e2d3a',Navy:'#1e2633',Black:'#252525'} as Record<string,string>)[c]||'#aaa'}} title={c}/>)}</div></Link>}
