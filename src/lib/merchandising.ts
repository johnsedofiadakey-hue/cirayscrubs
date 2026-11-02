import type {CatalogBundle,CatalogEntry,CollectionRule,CuratedCollection} from './types';

export const badgeLabels:Record<string,string>={new:'New',new_style:'New style',new_color:'New color',best_seller:'Best seller',limited_edition:'Limited edition',back_in_stock:'Back in stock'};
export function productBadge(entry:CatalogEntry,bundle?:CatalogBundle):string|null{
  if(entry.badge)return badgeLabels[entry.badge]||entry.badge.replaceAll('_',' ');
  if(bundle?.bestSellers.includes(entry.handle))return badgeLabels.best_seller;
  if(entry.launchedAt){const age=Date.now()-Date.parse(entry.launchedAt);if(Number.isFinite(age)&&age>=0&&age<45*86400000)return badgeLabels.new}
  return null;
}
export function matchesRule(entry:CatalogEntry,rule:CollectionRule,bundle:CatalogBundle):boolean{
  if(rule.department&&entry.department!==rule.department)return false;
  if(rule.productTypes?.length&&!rule.productTypes.includes(entry.productType))return false;
  if(rule.fits?.length&&!rule.fits.includes(entry.fit||''))return false;
  if(rule.fabricIds?.length&&!rule.fabricIds.includes(entry.fabricId||''))return false;
  if(rule.styleNames?.length&&!rule.styleNames.includes(entry.styleName||''))return false;
  if(rule.tagsAny?.length&&!rule.tagsAny.some(tag=>entry.tags?.includes(tag)))return false;
  if(rule.colorGroup&&!entry.colors.some(color=>bundle.colorGroups[color]===rule.colorGroup))return false;
  if(rule.badge&&productBadge(entry,bundle)?.toLowerCase().replaceAll(' ','_')!==rule.badge)return false;
  if(rule.onSaleOnly&&!entry.onSale)return false;
  if(rule.newArrivalsOnly){const age=Date.now()-Date.parse(entry.launchedAt||'');if(!Number.isFinite(age)||age<0||age>=45*86400000)return false}
  if(rule.bestSellersOnly&&entry.badge!=='best_seller'&&!bundle.bestSellers.includes(entry.handle))return false;
  return true;
}
export function collectionMembers(collection:CuratedCollection,bundle:CatalogBundle){const byHandle=new Map(bundle.entries.map(entry=>[entry.handle,entry]));return collection.source.kind==='manual'?collection.source.handles.map(handle=>byHandle.get(handle)).filter((entry):entry is CatalogEntry=>!!entry):bundle.entries.filter(entry=>matchesRule(entry,collection.source.kind==='rule'?collection.source.rule:{},bundle))}
export function sortProducts(entries:CatalogEntry[],sort:string,bundle:CatalogBundle,manualOrder?:string[]){const rank=(entry:CatalogEntry)=>{const i=bundle.bestSellers.indexOf(entry.handle);return i<0?Number.MAX_SAFE_INTEGER:i};const date=(entry:CatalogEntry)=>Date.parse(entry.launchedAt||'')||0;const list=[...entries];switch(sort){case 'featured':return list.sort((a,b)=>manualOrder?manualOrder.indexOf(a.handle)-manualOrder.indexOf(b.handle):rank(a)-rank(b)||date(b)-date(a)||a.title.localeCompare(b.title));case 'best_selling':return list.sort((a,b)=>rank(a)-rank(b)||a.title.localeCompare(b.title));case 'newest':return list.sort((a,b)=>date(b)-date(a));case 'price_asc':return list.sort((a,b)=>a.priceMinCents-b.priceMinCents);case 'price_desc':return list.sort((a,b)=>b.priceMinCents-a.priceMinCents);case 'title':return list.sort((a,b)=>a.title.localeCompare(b.title));default:return list}}
