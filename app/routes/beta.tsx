import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import {json, redirect} from '@remix-run/node';
export async function loader({request, params}: LoaderArgs) {
 
const user = await isAuthenticated(request);
if (!user) {
return redirect('/login')
}
return json({user})
}