import { useRootLoaderData } from '../utilities';
import React from 'react';
export const LoggedIn = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRootLoaderData();
   return user ? <>{children}</> : null;
};