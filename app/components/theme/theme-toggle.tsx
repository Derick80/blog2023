import { GlobeIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'
import { useRootLoaderData } from '~/root'
import { useFetcher } from '@remix-run/react'
import { Theme } from '~/.server/theme.server.ts'
// https://github.com/kentcdodds/kentcdodds.com/blob/main/app/components/navbar.tsx
export function ThemeToggle() {
    const themeFetcher = useFetcher()
    const onThemeChange = (theme: Theme) => {
        themeFetcher.submit(
            { theme },
            {
                method: 'POST',
                action: '/actions/set-theme'
            }
        )
    }
    const data = useRootLoaderData()

    const mode = data?.theme

    const nextMode =
        mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'

    return (
        <>
            <Button
                type='submit'
                variant='ghost'
                onClick={() => onThemeChange(nextMode)}
            >
                <input type='hidden' name='theme' value={nextMode} />
                {mode === 'light' && <SunIcon />}
                {mode === 'dark' && <MoonIcon />}
                {mode === 'system' && <GlobeIcon />}
            </Button>
        </>
    )
}
