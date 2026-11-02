import {Suspense} from 'react';
import {ProductClient} from '@/components/product-client';
async function ProductContent({params}:{params:Promise<{handle:string}>}){const {handle}=await params;return <ProductClient handle={handle}/>}
export default function ProductPage(props:{params:Promise<{handle:string}>}){return <Suspense fallback={<main className="page-wrap loading-page">Loading product…</main>}><ProductContent {...props}/></Suspense>}
