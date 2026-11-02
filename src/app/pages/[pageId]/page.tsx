import {Suspense} from 'react';
import {HomeClient} from '@/components/home-client';
async function Content({params}:{params:Promise<{pageId:string}>}){const {pageId}=await params;return <HomeClient pageId={pageId}/>}
export default function ContentPage(props:{params:Promise<{pageId:string}>}){return <Suspense fallback={<main className="page-wrap loading-page">Loading page…</main>}><Content {...props}/></Suspense>}
