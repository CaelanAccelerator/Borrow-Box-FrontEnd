'use client';

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {type Navigation } from '@toolpad/core/AppProvider';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import { CssBaseline } from '@mui/material';


const NAVIGATION: Navigation = [
  {
    segment: 'listings',
    title: 'Discover Your Next Adventure',
  },
  {
    segment: 'orders',
    title: 'Orders & Rental History',
  },
  {
    segment: 'ItemManagement',
    title: 'My Items',
  },
  {
    segment: 'messages',
    title: 'Messaging & Notifications',
  },
  {
    segment: 'profile',
    title: 'Profile & Settings',
  },
];

const AppTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});



export {NAVIGATION, AppTheme};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <DashboardLayout disableCollapsibleSidebar={true}>
        {children}
      </DashboardLayout>
    </ThemeProvider>
  );
}