import type { V2_MetaFunction } from "@remix-run/react";
import { useOptionalUser } from '~/utilities'

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  const user = useOptionalUser()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        {user && (
          <li>
            <div className='flex flex-row'>
              <p>{user.email}</p>

            </div>

              </li>
              )}
      </ul>
    </div>
  );
}
