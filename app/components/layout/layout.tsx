import ScrollToTop from '../v2-components/scroll-to-top'
import NavigationBar from './navbar'

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <main className='mx-auto flex h-auto gap-5 w-full p-1 max-w-screen-lg flex-col font-robo sm:p-1 md:flex-row  md:p-2 lg:flex-col lg:p-3'>
      <NavigationBar />
      <div className='mx-auto flex h-screen w-full flex-col p-2 md:p-4'>
        { children }
      </div>
      <ScrollToTop />
    </main>
  )
}
