import {Suspense} from 'react';
import {OrderSuccessClient} from '@/components/order-success-client';
async function Confirmation({searchParams}:{searchParams:Promise<{order?:string;session_id?:string}>}){const q=await searchParams;return <OrderSuccessClient orderId={q.order||''} sessionId={q.session_id||''}/>}
export default function Success(props:{searchParams:Promise<{order?:string;session_id?:string}>}){return <Suspense fallback={<main className="page-wrap loading-page">Checking your order…</main>}><Confirmation {...props}/></Suspense>}
