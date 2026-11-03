'use client';
import {useEffect,useState} from 'react';
import {adminLoadInventory,adminSetInventory,adminSetProductStatus,type AdminInventoryRow} from '@/lib/api';
import {isDemo} from '@/lib/firebase-client';
import {figsPreviewSources} from '@/lib/figs-preview';
import type {Product} from '@/lib/types';

function StockRow({row,onSave}:{row:AdminInventoryRow;onSave:(sku:string,quantity:number)=>Promise<void>}){
 const [quantity,setQuantity]=useState(String(row.available));
 const [busy,setBusy]=useState(false);
 useEffect(()=>{queueMicrotask(()=>setQuantity(String(row.available)))},[row.available]);
 return <tr><td>{row.color}</td><td>{row.size}</td><td>{row.length}</td><td><input className="inventory-quantity" type="number" min="0" step="1" value={quantity} onChange={event=>setQuantity(event.target.value)} aria-label={`${row.color} ${row.size} ${row.length} stock`}/></td><td><button type="button" disabled={busy||quantity===String(row.available)||!Number.isSafeInteger(Number(quantity))||Number(quantity)<0||quantity===''} onClick={async()=>{setBusy(true);try{await onSave(row.sku,Number(quantity))}finally{setBusy(false)}}}>Save</button></td></tr>;
}

export function AdminInventory({products,canManage,onChanged}:{products:Product[];canManage:boolean;onChanged:()=>Promise<void>}){
 const [productId,setProductId]=useState('');
 const [rows,setRows]=useState<AdminInventoryRow[]>([]);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState('');
 const selected=products.find(product=>product.handle===productId);
 useEffect(()=>{if(!productId&&products.length)queueMicrotask(()=>setProductId(products[0].handle))},[productId,products]);
 useEffect(()=>{if(!productId)return;let live=true;adminLoadInventory(productId).then(value=>{if(live)setRows(value)}).catch(error=>{if(live)setNotice(error instanceof Error?error.message:'Could not load stock')});return()=>{live=false}},[productId]);
 async function reload(){setRows(await adminLoadInventory(productId))}
 async function saveStock(sku:string,quantity:number){try{await adminSetInventory(sku,quantity);await reload();setNotice(quantity===0?'Size marked out of stock. Refresh the shop to see the change.':'Stock saved. Refresh the shop to see the change.')}catch(error){setNotice(error instanceof Error?error.message:'Could not save stock')}}
 async function changeStatus(){if(!selected)return;setBusy(true);try{const status=selected.status==='active'?'draft':'active';await adminSetProductStatus(selected.handle,status);await onChanged();setNotice(status==='draft'?'Product hidden from the storefront.':'Product visible in the current store mode.')}catch(error){setNotice(error instanceof Error?error.message:'Could not change visibility')}finally{setBusy(false)}}
 return <section className="admin-card" id="inventory"><div className="admin-card-head"><div><h2>Inventory and visibility</h2><p>Set a size to zero to mark it sold out. Hide a whole style by moving it to draft.</p></div></div><div className="inventory-toolbar"><label>Product<select value={productId} onChange={event=>{setProductId(event.target.value);setRows([]);setNotice('')}}>{products.map(product=><option value={product.handle} key={product.handle}>{product.title} · {product.status}</option>)}</select></label>{selected&&canManage&&<button type="button" className="btn btn-outline" disabled={busy} onClick={changeStatus}>{selected.status==='active'?'Hide product':'Show product'}</button>}</div>{selected&&isDemo()&&figsPreviewSources[selected.handle]&&<p className="inventory-source">Preview reference: <a href={figsPreviewSources[selected.handle]} target="_blank" rel="noopener noreferrer">View FIGS style</a>. Confirm Ciray stock, pricing and image rights before launch.</p>}{notice&&<p className="admin-note" role="status">{notice}</p>}<div className="table-scroll"><table className="admin-table inventory-table"><thead><tr><th>Colour</th><th>Size</th><th>Length</th><th>Units</th><th></th></tr></thead><tbody>{rows.map(row=><StockRow key={row.sku} row={row} onSave={saveStock}/>)}</tbody></table></div>{!rows.length&&<p className="admin-placeholder">Choose a product with variants to edit stock.</p>}</section>;
}
