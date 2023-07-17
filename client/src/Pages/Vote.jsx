import React, { useState } from 'react'
import * as fcl from '@onflow/fcl'
import '../flow/config'
import Popup from '../Components/Popup'

const Vote = () => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [voted, setVoted] = useState({ bool: false, txID: 0 })

  const vote = async playerId => {
    try {
      console.log('Starting Txn')
      const transactionID = await fcl.mutate({
        cadence: `
        import PlayerNFT from 0x3e830d88a864b1a0

        transaction(playerID: UInt64){

            prepare(acct: AuthAccount){
              PlayerNFT.vote(Player_id: playerID, user: acct.address)
            }
            
            execute{
                log("Voted")
            }

        }
        `,
        args: (arg, t) => [arg(playerId, t.UInt64)],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 9999
      })
      const transaction = await fcl
        .tx(transactionID)
        .onceSealed()
        .then(()=>{
          setVoted({bool: true,txID: transactionID})
        })
    } catch (error) {
      alert('Err in Voting')
      console.log(error)
    }
  }

  return (
    <>
      { voted.bool ? <Popup txID={voted.txID} type='vote'/>  :
        <div>
          <h1 className='text-3xl font-medium leading-loose text-orange-200 mt-16 ml-10'>
            Vote players based on your supporting team and matches' POAP:
          </h1>
          <h2 className='text-xl font-medium leading-loose text-orange-200 mt-4 ml-10'>
            Only 1 Vote per POAP and MatchID
          </h2>
          <div class='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {keys.map((num, i) => (
              <div className='m-16'>
                <img
                  src={
                    'https://gateway.lighthouse.storage/ipfs/QmNoecJr6Uv8sYYtxJYqK1YPqSTLepAhRcin4qsnjucfB7/' +
                    num +
                    '.png'
                  }
                  key={i}
                  class='h-auto max-w-full rounded-lg'
                  alt={'Browns' + num}
                />
                <p class='text-orange-200 m-4'>Match ID: 1, Player ID: {num}</p>
                <p class='text-orange-200 m-4'>
                  Current Average Match Populatrity (AMP):{' '}
                  <b>{(Math.random() * 10).toPrecision(3)}</b>
                </p>
                <button
                  type='button'
                  class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                  onClick={() => vote(i)}
                >
                  Vote{' '}
                </button>
              </div>
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default Vote
