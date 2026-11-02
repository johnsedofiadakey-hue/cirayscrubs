import {Suspense} from 'react';
import {CuratedCollectionClient} from '@/components/curated-collection-client';
import {BottlesClient} from '@/components/bottles-client';
async function Content({params,searchParams}:{params:Promise<{handle:string}>;searchParams:Promise<{color?:string}>}){const {handle}=await params,{color}=await searchParams;if(handle==='bottles')return <BottlesClient/>;return <CuratedCollectionClient key={`${handle}-${color||''}`} handle={handle} initialColor={color||''}/>}
export default function CollectionPage(props:{params:Promise<{handle:string}>;searchParams:Promise<{color?:string}>}){return <Suspense fallback={<main className="page-wrap loading-page">Loading collection…</main>}><Content {...props}/></Suspense>}
