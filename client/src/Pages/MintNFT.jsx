import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as fcl from '@onflow/fcl'
import '../flow/config'
import { authorizationFunction } from '../helper/authorization'
import Popup from '../Components/Popup'

const MintNFT = () => {
  const [qrData, setQrData] = useState({
    updated: false,
    ticketNo: 0,
    matchID: 0,
    home: 'Cowboys',
    away: 'Giants'
  })
  const [user, setUser] = useState()

  const [Proof, setProof] = useState('')
  const [teamSelected, setTeamSelected] = useState(0)

  const [minted, setMinted] = useState({bool: false, txID: 0, add: ''})

  

  useEffect(() => {
    fcl.currentUser.subscribe(data => {
      setUser(data.addr)
      console.log(data.addr)
    })
  }, [])

  const setupAcc = async () => {
    try {
      const transactionID = await fcl.mutate({
        cadence: `
        import ZLocNFT from 0x3e830d88a864b1a0
        import NonFungibleToken from 0x3e830d88a864b1a0

        transaction {

          prepare(acct: AuthAccount) {
            acct.save(<- ZLocNFT.createEmptyCollection(), to: /storage/Collection);
            acct.link<&ZLocNFT.Collection{NonFungibleToken.CollectionPublic, ZLocNFT.ZlocNFTCollectionPublic}>(/public/CollectionPublic, target: /storage/Collection);
          }

          execute {
            log("Created a collection and stored")
          }
        }
        `,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 9999
      })
      const transaction = await fcl
        .tx(transactionID)
        .onceSealed()
        .then(console.log)
      console.log(transaction)
    } catch (error) {
      alert("Err in setting up account")
      console.log(error);
    }
  }

  const submitTransaction = async () => {
    try {
      console.log('Starting Txn')
      const acc_add = user
      console.log(acc_add)
      const transactionID = await fcl.mutate({
        cadence: `
        import ZLocNFT from 0x3e830d88a864b1a0
  
        transaction(recepient: Address,id: UInt64, team: UInt8, zk_bytes32: String, ticket: UInt64){

          prepare(acct: AuthAccount){
              let minter = acct.borrow<&ZLocNFT.NFTMinter>(from: /storage/Minter)!;
              let publicRef = getAccount(recepient).getCapability(/public/CollectionPublic)
                                  .borrow<&ZLocNFT.Collection{ZLocNFT.ZlocNFTCollectionPublic}>()
                                  ?? panic("No Collection Found in recepient")
              publicRef.deposit(token: <- minter.createNFT(matchID: id, team: team, zk: zk_bytes32, ticket: ticket))
              log(acct.address)
          }
          
          execute{
              log("NFT minted")
          }
      }
        `,
        args: (arg, t) => [
          arg(acc_add, t.Address),
          arg(qrData.matchID, t.UInt64),
          arg(teamSelected, t.UInt8),
          arg(Proof, t.String),
          arg(qrData.ticketNo, t.UInt64)
        ],
        proposer: authorizationFunction,
        payer: authorizationFunction,
        authorizations: [authorizationFunction],
        limit: 9999
      })
      const transaction = await fcl
        .tx(transactionID)
        .onceSealed()
        .then(
          ()=>{
            setMinted({bool: true, txID: transactionID, add: user});
          }
        )

    } catch (error) {
      alert('Err in miniting NFt')
      console.log(error)
    }
  }

  const zkAPI = async (latitude, longitude) => {
    try {
      let headersList = {
        Accept: '*/*',
        'Content-Type': 'application/json'
      }

      let bodyContent = JSON.stringify({
        LtR: [18, 21],
        LoR: [70, 75],
        loc: [Math.floor(latitude), Math.floor(longitude)]
      })

      let reqOptions = {
        url: 'https://jittery-belt-crab.cyclic.app/proof/',
        method: 'POST',
        headers: headersList,
        data: bodyContent
      }

      await axios.request(reqOptions).then(res => {
        setProof(res.data.proof);
        console.log(res.data.proof);
      })
    } catch (error) {
      console.log(error)
      alert('Unauthorized location')
    }
  }
  const locSuccessCallback = async position => {
    const { latitude, longitude } = position.coords

    await zkAPI(latitude, longitude)
    await setupAcc()
    await submitTransaction()
  }
  const locErrCallback = async position => {
    alert('Error fetching position !!!')
    console.log(position)
  }
  const handleClick = async () => {
    console.log(teamSelected)
    await navigator.geolocation.getCurrentPosition(
      locSuccessCallback,
      locErrCallback
    )
  }
  return (
    <>
      {minted.bool ? (
        <Popup txID={minted.txID} add={minted.add}/>
      ) : (
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
                value={0}
                name='default-radio'
                class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                onChange={e => {
                  setTeamSelected(e.target.value)
                }}
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
                id='default-radio-2'
                type='radio'
                value={1}
                name='default-radio'
                class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                onChange={e => {
                  setTeamSelected(e.target.value)
                }}
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
      )}
    </>
  )
}

export default MintNFT
