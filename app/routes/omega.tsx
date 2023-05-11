import * as Portal from '@radix-ui/react-portal'
export default function OmegaRout() {
  return (
    <main className='flex flex-col items-center justify-center'>
      <Portal.Root
        container={document.body}
        className='fixed inset-0 flex flex-col items-center justify-center'
      >
        <form>
          <h1 className='text-2xl font-bold'>Omega</h1>
          <h1 className='text-2xl font-bold'>Omega</h1>
          <h1 className='text-2xl font-bold'>Omega</h1>
          <h1 className='text-2xl font-bold'>Omega</h1>
        </form>
      </Portal.Root>
    </main>
  )
}
