import React from 'react'

const Popup = props => {
  if ((props.type === 'vote')) {
    return (
      <div>
        <div
          id='staticModal'
          tabindex='-1'
          class='fixed ml-72 mt-52 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full'
        >
          <div class='relative w-full max-w-2xl max-h-full'>
            <div class='relative bg-white rounded-lg shadow dark:bg-gray-700'>
              <div class='flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600'>
                <h3 class='text-xl font-semibold text-gray-900 dark:text-white'>
                  Player Voted ✅
                </h3>
              </div>

              <div class='p-6 space-y-6'>
                <p class='text-base leading-relaxed text-gray-500 dark:text-zinc-100'>
                  Player succesfully voted
                </p>
                <a
                  href={
                    'https://testnet.flowscan.org/transaction/' + props.txID
                  }
                  target='_blank'
                  className='text-blue text-zinc-100'
                >
                  View Transaction
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div
          id='staticModal'
          tabindex='-1'
          class='fixed ml-72 mt-52 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full'
        >
          <div class='relative w-full max-w-2xl max-h-full'>
            <div class='relative bg-white rounded-lg shadow dark:bg-gray-700'>
              <div class='flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600'>
                <h3 class='text-xl font-semibold text-gray-900 dark:text-white'>
                  NFT Minted ✅
                </h3>
              </div>

              <div class='p-6 space-y-6'>
                <p class='text-base leading-relaxed text-gray-500 dark:text-zinc-100'>
                  NFT Minted to {props.add}
                </p>
                <a
                  href={
                    'https://testnet.flowscan.org/transaction/' + props.txID
                  }
                  target='_blank'
                  className='text-blue text-zinc-100'
                >
                  View Transaction
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Popup
