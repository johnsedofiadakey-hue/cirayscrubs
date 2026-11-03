import type {Metadata} from 'next';
import {Raleway} from 'next/font/google';
import './globals.css';
const raleway=Raleway({subsets:['latin'],display:'swap',variable:'--font-ciray-sans'});
export const metadata:Metadata={title:{default:'Ciray Scrubs',template:'%s | Ciray Scrubs'},description:'Premium scrubs for every shift.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={raleway.variable}><body>{children}</body></html>}
