import type { ActionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import {json} from '@remix-run/node';
export async function action({request, params}: ActionArgs) {
 
const user = await isAuthenticated(request);
if (!user) {
return json({error: 'Not authenticated'})
}
return json({user})
}