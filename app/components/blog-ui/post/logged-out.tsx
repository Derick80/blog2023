import { useRootLoaderData } from "~/utilities";
import React from "react";
export const LoggedOut = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRootLoaderData();
   return user ? null : <>{children}</>;
};