import React from 'react'
import {useNavigate} from 'react-router-dom'
const Mint = () => {
  const navigate = useNavigate();
  return (
    <div className='flex content-center ml-44 mt-32 text-center  justify-evenly'>
      <img
        src='qr_scan.png'
        alt='qr_scan'
        className='xl:bg-transparent h-96 '
      />
      <div > 
        <h1 className='text-3xl font-medium leading-loose text-orange-200 mt-20'>
          Scan QR Code On Ticket to mint POAP of event <br /> future rewards
          might be awaiting you !!!
        </h1>
        <button type="button" class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2 mt-16 text-m" onClick={()=>navigate("/mintNFT")}>Generate POAP NFT</button>
      </div>
    </div>
  )
}

export default Mint
