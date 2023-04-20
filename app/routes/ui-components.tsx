import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { ColBox, RowBox } from '~/components/boxes'
import Button from '~/components/button'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  return json({ user })
}

export default function ComponentsIndex() {
  return (
    <div className='flex flex-col gap-1'>
      <h1 className='text-2xl font-bold'>UI Components</h1>
      <RowBox>
        <ColBox>
          <div className='flex flex-col items-start gap-2'>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Primary</h6>
              <RowBox>
                <Button size='small' variant='primary'>
                  large
                </Button>
                <Button size='small' variant='primary'>
                  base
                </Button>
                <Button size='small' variant='primary'>
                  small
                </Button>
                <Button size='small' variant='primary'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Primary Filled</h6>
              <RowBox>
                <Button size='large' variant='primary_filled'>
                  large
                </Button>
                <Button size='base' variant='primary_filled'>
                  base
                </Button>
                <Button size='small' variant='primary_filled'>
                  small
                </Button>
                <Button size='tiny' variant='primary_filled'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Ghost</h6>
              <RowBox>
                <Button size='large' variant='ghost'>
                  large
                </Button>
                <Button size='base' variant='ghost'>
                  base
                </Button>
                <Button size='small' variant='ghost'>
                  small
                </Button>
                <Button size='tiny' variant='ghost'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Success</h6>
              <RowBox>
                <Button size='large' variant='success'>
                  large
                </Button>
                <Button size='base' variant='success'>
                  base
                </Button>
                <Button size='small' variant='success'>
                  small
                </Button>
                <Button size='tiny' variant='success'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Success Filled</h6>
              <RowBox>
                <Button size='large' variant='success_filled'>
                  large
                </Button>
                <Button size='base' variant='success_filled'>
                  base
                </Button>
                <Button size='small' variant='success_filled'>
                  small
                </Button>
                <Button size='tiny' variant='success_filled'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Danger</h6>
              <RowBox>
                <Button size='large' variant='danger'>
                  large
                </Button>
                <Button size='base' variant='danger'>
                  base
                </Button>
                <Button size='small' variant='danger'>
                  small
                </Button>
                <Button size='tiny' variant='danger'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Danger Filled</h6>
              <RowBox>
                <Button size='large' variant='danger_filled'>
                  large
                </Button>
                <Button size='base' variant='danger_filled'>
                  base
                </Button>
                <Button size='small' variant='danger_filled'>
                  small
                </Button>

                <Button size='tiny' variant='danger_filled'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>

            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Warning</h6>
              <RowBox>
                <Button size='large' variant='warning'>
                  large
                </Button>
                <Button size='base' variant='warning'>
                  base
                </Button>
                <Button size='small' variant='warning'>
                  small
                </Button>
                <Button size='tiny' variant='warning'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Warning Filled</h6>
              <RowBox>
                <Button size='large' variant='warning_filled'>
                  large
                </Button>

                <Button size='base' variant='warning_filled'>
                  base
                </Button>
                <Button size='small' variant='warning_filled'>
                  small
                </Button>
                <Button size='tiny' variant='warning_filled'>
                  tiny
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Icon Unfilled</h6>
              <RowBox>
                <Button size='large' variant='icon_unfilled'>
                  <PaperPlaneIcon />
                </Button>
                <Button size='base' variant='icon_unfilled'>
                  <PaperPlaneIcon />
                </Button>
                <Button size='small' variant='icon_unfilled'>
                  <PaperPlaneIcon />
                </Button>
                <Button size='tiny' variant='icon_unfilled'>
                  <PaperPlaneIcon />
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Icon Filled</h6>
              <RowBox>
                <Button size='large' variant='icon_filled'>
                  <PaperPlaneIcon />
                </Button>

                <Button size='base' variant='icon_filled'>
                  <PaperPlaneIcon />
                </Button>
                <Button size='small' variant='icon_filled'>
                  <PaperPlaneIcon />
                </Button>
                <Button size='tiny' variant='icon_filled'>
                  <PaperPlaneIcon />
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Icon Text Unfilled </h6>
              <RowBox>
                <Button size='large' variant='icon_text_unfilled'>
                  <span className=''>large</span>

                  <PaperPlaneIcon />
                </Button>
                <Button size='base' variant='icon_text_unfilled'>
                  <span className=''>base</span>
                  <PaperPlaneIcon />
                </Button>
                <Button size='small' variant='icon_text_unfilled'>
                  <span className=''>small</span>
                  <PaperPlaneIcon />
                </Button>
                <Button size='tiny' variant='icon_text_unfilled'>
                  tiny
                  <PaperPlaneIcon />
                </Button>
              </RowBox>
            </ColBox>
            <ColBox className='items-start'>
              <h6 className='text-sm font-bold'>Icon Text Filled </h6>
              <RowBox>
                <Button size='large' variant='icon_text_filled'>
                  <span className=''>large</span>
                  <PaperPlaneIcon />
                </Button>
                <Button size='base' variant='icon_text_filled'>
                  <span className=''>base</span>
                  <PaperPlaneIcon />
                </Button>
                <Button size='small' variant='icon_text_filled'>
                  <span className=''>small</span>
                  <PaperPlaneIcon />
                </Button>
                <Button size='tiny' variant='icon_text_filled'>
                  tiny
                  <PaperPlaneIcon />
                </Button>
              </RowBox>
            </ColBox>
          </div>
        </ColBox>
        <ColBox className=''>Second column here</ColBox>
      </RowBox>
    </div>
  )
}
