import ZLocNFT from 0x3e830d88a864b1a0

transaction(recepient: Address, matchID: UInt64, teamCode : UInt8){

    prepare(acct: AuthAccount){
        let nftMinter = acct.borrow<&ZLocNFT.NFTMinter>(from: /storage/Minter)!;

        let publicRef = getAccount(recepient).getCapability(/public/CollectionPublic)
                            .borrow<&ZLocNFT.Collection{ZLocNFT.ZlocNFTCollectionPublic}>()
                            ?? panic("No Collection Found in recepient")
        publicRef.deposit(token: <- nftMinter.createNFT(name: "FCB vs RM", matchID: matchID, team: teamCode))
    }

    execute{
        log("NFT minted !")
    }
}

