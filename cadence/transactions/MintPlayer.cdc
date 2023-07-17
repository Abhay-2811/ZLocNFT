import PlayerNFT from 0x3e830d88a864b1a0
import NonFungibleToken from 0x3e830d88a864b1a0

transaction(name: String){

    prepare(acct: AuthAccount){
        let minter = acct.borrow<&PlayerNFT.PNFTMinter>(from: /storage/PlayerNFTMinter)!;
        acct.save(<- PlayerNFT.createEmptyCollection(), to: /storage/PlayerNFTCollection);
    acct.link<&PlayerNFT.Collection{NonFungibleToken.CollectionPublic, PlayerNFT.PNFTCollectionPublic}>(/public/PlayerNFTCollectionPublic, target: /storage/PlayerNFTCollection);
        let publicRef = acct.getCapability(/public/PlayerNFTCollectionPublic)
                            .borrow<&PlayerNFT.Collection{PlayerNFT.PNFTCollectionPublic}>()
                            ?? panic("No Collection Found in recepient")
        publicRef.deposit(token: <- minter.createNFT(name:name))
        log(acct.address)
    }
    
    execute{
        log("NFT minted")
    }
}

//0xcb20cd1f08decd61