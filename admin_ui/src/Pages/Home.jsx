// we need to be looged in to view content

import React, { useEffect, useState } from 'react'
import * as fcl from '@onflow/fcl'
import { Encoder, QRByte } from '@nuintun/qrcode'

const Home = () => {
  const [matchId, setMatchId] = useState(0)
  const [matchName, setMatchName] = useState('')
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [homeImg, setHomeImg] = useState('')
  const [awayImg, setAwayImg] = useState('')
  const [tickets, setTickets] = useState('')
  const [txSuccess, setTxSuccess] = useState(false)
  const [loading, setLoading] = useState()


  const handleSubmit = async e => {
    e.preventDefault()
    var validTickets = tickets.split(',').map(Number)
    console.log(typeof validTickets)
    // validTickets = `[${validTickets}]`
    // console.log(validTickets);
    // const qrcode = new Encoder();
    // qrcode.write('{"ticketNo":"01","matchID":"01"}');
    // qrcode.make()
    // setQr(qrcode.toDataURL(5,5));
    const transactionID = await fcl.mutate({
      cadence: `
      import ZLocNFT from 0x4848e38784043ea5

      transaction(id: UInt64,name: String, home: String, away: String, hi: String, ai: String, tickets: [UInt64]){
      
          prepare(acct: AuthAccount){
              let minter = acct.borrow<&ZLocNFT.NFTMinter>(from: /storage/Minter)!;
              minter.createMatch(id: id,name: name, home: home, away: away, homeImg: hi, awayImg: ai, tickets: tickets)
          }
          
          execute{
              log("Match Created")
          }
      }
      `,
      args: (arg, t) => [
        arg(matchId, t.UInt64),
        arg(matchName, t.String),
        arg(homeTeam, t.String),
        arg(awayTeam, t.String),
        arg(homeImg, t.String),
        arg(awayImg, t.String),
        arg(validTickets, t.Array(t.UInt64))
      ],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 50
    })
    setLoading(true)
    const transaction = await fcl
      .tx(transactionID)
      .onceSealed()
      .then(() => setTxSuccess(true))
    console.log(transaction)
  }

  return (
    <form className='ml-60 mt-36 mr-20 ' onSubmit={handleSubmit}>
      <div className='relative z-0 w-full mb-6 group'>
        <input
          type='number'
          name='match_id'
          id='match_id'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
          placeholder=' '
          required
          onChange={e => {
            e.preventDefault()
            setMatchId(e.target.value)
          }}
        />
        <label
          for='match_id'
          className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Match Id ( Unique )
        </label>
      </div>
      <div className='relative z-0 w-full mb-6 group'>
        <input
          type='text'
          name='match_name'
          id='match_name'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
          placeholder=' '
          required
          onChange={e => {
            e.preventDefault()
            setMatchName(e.target.value)
          }}
        />
        <label
          for='match_name'
          className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Match Name
        </label>
      </div>

      <div className='grid md:grid-cols-2 md:gap-6'>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='text'
            name='home_team'
            id='home_team'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
            onChange={e => {
              e.preventDefault()
              setHomeTeam(e.target.value)
            }}
          />
          <label
            for='home_team'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Home Team
          </label>
        </div>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='url'
            name='home_team_img'
            id='home_team_img'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
            onChange={e => {
              e.preventDefault()
              setHomeImg(e.target.value)
            }}
          />
          <label
            for='home_team_img'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Home Team NFT Image URL
          </label>
        </div>
      </div>
      <div className='grid md:grid-cols-2 md:gap-6'>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='text'
            name='away_team'
            id='away_team'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
            onChange={e => {
              e.preventDefault()
              setAwayTeam(e.target.value)
            }}
          />
          <label
            for='away_team'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Away Team
          </label>
        </div>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='url'
            name='away_team_img'
            id='away_team_img'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
            onChange={e => {
              e.preventDefault()
              setAwayImg(e.target.value)
            }}
          />
          <label
            for='away_team_img'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Away Team NFT Image URL
          </label>
        </div>
      </div>
      <div className='relative z-0 w-full mb-6 group'>
        <input
          type='text'
          name='ticket_nos'
          id='ticket_nos'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
          placeholder=' '
          required
          onChange={e => {
            e.preventDefault()
            setTickets(e.target.value)
          }}
        />
        <label
          for='ticket_nos'
          className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Enter Valid Ticket Numbers ( Each separated by " <b>,</b> " without
          any whitespaces )
        </label>
      </div>

      {txSuccess ? (
        <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
          Match Successfully Created
        </button>
      ) : (
        <>
          {loading ? (
            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              <svg
                aria-hidden='true'
                role='status'
                class='inline w-4 h-4 mr-3 text-white animate-spin'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='#E5E7EB'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentColor'
                />
              </svg>
            </button>
          ) : (
            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              Submit
            </button>
          )}
        </>
      )}
    </form>
  )
}

export default Home
