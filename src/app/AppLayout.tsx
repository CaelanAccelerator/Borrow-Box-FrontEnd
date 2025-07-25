'use client';

import React from 'react';
import { createTheme } from '@mui/material/styles';
import {type Navigation } from '@toolpad/core/AppProvider';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';


const NAVIGATION: Navigation = [
  {
    segment: 'home',
    title: 'Home & Discovery',

  },
  {
    segment: 'listings',
    title: 'My Listings & Management',
  },
  {
    segment: 'orders',
    title: 'Orders & Rental History',
  },
  {
    segment: 'messages',
    title: 'Messaging & Notifications',
  },
  {
    segment: 'payments',
    title: 'Payments & Billing',
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
  // DashboardLayout will read your NAVIGATION from NextAppProvider
  return (
    <DashboardLayout disableCollapsibleSidebar = {true}>
      {children}
    </DashboardLayout>
  );
}