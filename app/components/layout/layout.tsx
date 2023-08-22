import ScrollToTop from '../v3-components/scroll-to-top'
import NavigationBar from './navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex h-auto w-full flex-col font-robo sm:p-1 md:flex-row  md:p-2 lg:flex-col lg:p-3'>
      <NavigationBar />
      <div className='mx-auto flex h-full w-full max-w-screen-lg flex-col p-2 md:p-4'>
        {children}
      </div>
      <ScrollToTop />
    </main>
  )
}
