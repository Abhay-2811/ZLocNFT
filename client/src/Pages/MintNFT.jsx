import React, { useState } from 'react'
import axios from 'axios'

const MintNFT = () => {
  const [qrData, setQrData] = useState({
    updated: false,
    ticketNo: 0,
    matchID: 0,
    home: 'Cowboys',
    away: 'Giants'
  })

  const locSuccessCallback = async position => {
    const { latitude, longitude } = position.coords
    let headersList = {
      "Accept": '*/*',
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      'Content-Type': 'application/json'
    }

    let bodyContent = JSON.stringify({
      LtR: [1, 10],
      LoR: [1, 10],
      loc: [Math.floor(latitude), Math.floor(longitude)]
    })

    let reqOptions = {
      url: 'https://jittery-belt-crab.cyclic.app/proof/',
      method: 'POST',
      headers: headersList,
      data: bodyContent
    }

    let response = await axios.request(reqOptions)
    console.log(response.data)
  }
  const locErrCallback = async position => {
    alert('Error fetching position !!!')
    console.log(position)
  }
  const handleClick = async () => {
    await navigator.geolocation.getCurrentPosition(
      locSuccessCallback,
      locErrCallback
    )
  }
  return (
    <div class='m-20'>
      <div>
        <label
          class='block mb-2 text-m font-medium text-gray-900 dark:text-orange-200'
          for='file_input'
        >
          Upload QR code
        </label>
        <hr class='h-px my-6 bg-gray-200 border-0 dark:bg-gray-700 w-48'></hr>
        <input
          class='block w-96 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
          id='file_input'
          type='file'
          onChange={() => {
            setQrData({ updated: true, ticketNo: 1, matchID: 1 })
            console.log('File Uploaded')
          }}
        />
      </div>
      {qrData.updated ? (
        <div class='mt-10'>
          <label class='block mb-2 text-m font-medium text-gray-900 dark:text-orange-200'>
            Match Data
          </label>
          <hr class='h-px my-6 bg-gray-200 border-0 dark:bg-gray-700 w-48'></hr>
          <div class='flex-col '>
            <p class=' text-sm font-medium text-gray-900 dark:text-gray-300 mb-4'>
              Match Id: {qrData.matchID}
            </p>

            <p class=' text-sm font-medium text-gray-900 dark:text-gray-300'>
              Ticket No: {qrData.ticketNo}
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div class='mt-10'>
        <label
          class='block mb-2 text-m font-medium text-gray-900 dark:text-orange-200'
          for='file_input'
        >
          Select Supporting Team
        </label>
        <hr class='h-px my-6 bg-gray-200 border-0 dark:bg-gray-700 w-48'></hr>
        <div class='flex items-center mb-4 '>
          <input
            id='default-radio-1'
            type='radio'
            value=''
            name='default-radio'
            class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label
            for='default-radio-1'
            class='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            {qrData.updated ? (
              <span> Home: Browns</span>
            ) : (
              <>Data Unavailable ( Upload QR )</>
            )}
          </label>
        </div>
        <div class='flex items-center'>
          <input
            checked
            id='default-radio-2'
            type='radio'
            value=''
            name='default-radio'
            class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label
            for='default-radio-2'
            class='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            {qrData.updated ? (
              <span> Away: Jets</span>
            ) : (
              <>Data Unavailable ( Upload QR )</>
            )}
          </label>
        </div>
        <button
          type='button'
          class='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2 mt-16 text-m'
          disabled={!qrData.updated}
          onClick={handleClick}
        >
          {qrData.updated ? (
            <span>Generate Location Proof and Mint NFT</span>
          ) : (
            <span>Upload QR first</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default MintNFT
