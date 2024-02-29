import { useRootLoaderData } from '~/utilities';

export const LoggedIn = ({ children }: { children: React.ReactNode }) => {
   const { user } = useRootLoaderData();
   return user ? <>{children}</> : null;
};