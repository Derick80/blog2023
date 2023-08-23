export default function ScrollingBanner() {
  return (
    <div className='aboslute bottom-0 left-0 flex w-full items-center justify-center overflow-hidden bg-yellow-200 p-2'>
      <img
        src='/WARNING.png' // Replace with your warning icon or image path
        alt='An Icon of a warning sign to indicate that the site is under construction'
        className='mr-2 h-6 w-6'
      />
      <div className='scrolling-text text-black'>
        THIS SITE IS UNDER CONSTRUCTION. PLEASE PARDON THE APPEARANCE WHILE I
        LEARN DESIGN. 🤣
      </div>
    </div>
  )
}
