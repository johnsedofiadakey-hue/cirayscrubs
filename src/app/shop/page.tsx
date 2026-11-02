import {Suspense} from 'react';
import {ShopClient} from '@/components/shop-client';
async function ShopContent({searchParams}:{searchParams:Promise<{department?:string;type?:string;color?:string}>}){const params=await searchParams;return <ShopClient key={`${params.department||''}-${params.type||''}-${params.color||''}`} department={params.department||''} type={params.type||''} initialColor={params.color||''}/>}
export default function Shop(props:{searchParams:Promise<{department?:string;type?:string;color?:string}>}){return <Suspense fallback={<main className="page-wrap loading-page">Loading collection…</main>}><ShopContent {...props}/></Suspense>}
