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