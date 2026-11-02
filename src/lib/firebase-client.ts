import {getApp,getApps,initializeApp,type FirebaseApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,type Auth} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,type Firestore} from 'firebase/firestore';
import {getFunctions,connectFunctionsEmulator,type Functions} from 'firebase/functions';
import {getStorage,connectStorageEmulator,type FirebaseStorage} from 'firebase/storage';
import {initializeAppCheck,ReCaptchaEnterpriseProvider} from 'firebase/app-check';
import type {Mode} from './types';
export const mode=process.env.NEXT_PUBLIC_CIRAY_MODE as Mode|undefined;
export function isDemo(){return mode==='demo'}
export interface Services{app:FirebaseApp;auth:Auth;db:Firestore;functions:Functions;storage:FirebaseStorage}
let cached:Services|undefined;
export function services():Services{
 if(typeof window==='undefined')throw new Error('Firebase services require a browser');
 if(cached)return cached;
 if(mode!=='firebase'&&mode!=='emulator')throw new Error('Set NEXT_PUBLIC_CIRAY_MODE to demo, emulator, or firebase');
 const config={apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID};
 if(!config.apiKey||!config.projectId||!config.appId||!config.storageBucket)throw new Error('Firebase web configuration is incomplete');
 const app=getApps().length?getApp():initializeApp(config);const auth=getAuth(app),db=getFirestore(app),functions=getFunctions(app,'us-central1'),storage=getStorage(app);
 if(mode==='emulator'){connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);connectFunctionsEmulator(functions,'127.0.0.1',5001);connectStorageEmulator(storage,'127.0.0.1',9199)}
 if(mode==='firebase'&&process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY){initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY),isTokenAutoRefreshEnabled:true})}
 return cached={app,auth,db,functions,storage};
}
