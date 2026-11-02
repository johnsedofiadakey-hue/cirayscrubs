import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'Ciray Scrubs',template:'%s | Ciray Scrubs'},description:'Premium scrubs for every shift.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
