// app/layout.tsx
import React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import {NAVIGATION, AppTheme} from './AppLayout';
import AppLayout from './AppLayout';

const BRANDING = {
  logo: null,
  title: 'Borrow Box',    
  homeUrl: '/home', 
}


export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAppProvider navigation={NAVIGATION} theme={AppTheme} branding ={BRANDING}>
          <AppLayout>
            {children}
          </AppLayout>
        </NextAppProvider>
      </body>
    </html>
  );
}
