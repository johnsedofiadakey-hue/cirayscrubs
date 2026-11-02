import {SiteHeader} from './site-header';
import {Footer} from './footer';
import {ThemeHydrator} from './theme-hydrator';
export function StoreLayout({children}:{children:React.ReactNode}){return <><ThemeHydrator/><SiteHeader/>{children}<Footer/></>}
