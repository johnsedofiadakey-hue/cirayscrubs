import type {Metadata} from 'next';
import {DM_Sans,Montserrat} from 'next/font/google';
import './globals.css';
const dmSans=DM_Sans({subsets:['latin'],display:'swap',variable:'--font-dm-sans'});
const montserrat=Montserrat({subsets:['latin'],display:'swap',variable:'--font-ciray-display'});
export const metadata:Metadata={title:{default:'Ciray Scrubs',template:'%s | Ciray Scrubs'},description:'Premium scrubs for every shift.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${dmSans.variable} ${montserrat.variable}`}><body>{children}</body></html>}
