import * as Tooltip from '@radix-ui/react-tooltip'

export default function ToolTip({
  tip,
  children
}: {
  tip: string
  children?: React.ReactNode
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className='z-10 rounded-md bg-slate-300 p-1 text-xs text-black dark:text-violet3'
            sideOffset={5}
          >
            {tip}
            <Tooltip.Arrow className='fill-white' />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
// maybe fix the tooltip with part of       "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
