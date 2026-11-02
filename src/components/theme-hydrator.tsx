'use client';
import {useEffect} from 'react';
import {restoreProductTheme} from '@/lib/theme';
export function ThemeHydrator(){useEffect(()=>{restoreProductTheme()},[]);return null}
