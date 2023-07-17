import React from 'react'

const ViewPoap = () => {
  return (
    <div className='ml-10'>
      <h1 className='text-3xl font-medium leading-loose text-orange-200 mt-16 '>
        Available ZLocNFT POAP's:
      </h1>

        <div class='flex mt-10'>
          <img
            class='max-w-full h-80 rounded-lg'
            src='jetsvbrowns.png'
            alt='jets_vs_browns'
          />
          <p class='ml-20 mt-20 text-orange-200 leading-10'>
            Match ID: 1 <br className=' leading-20'/>
            Supporting Team: Home ( Browns ) <br />
            Organiser: NFL ( 0xcb20cd1f08decd61 )
          </p>
        
      </div>
    </div>
  )
}

export default ViewPoap
