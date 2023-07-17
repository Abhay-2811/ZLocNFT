import PlayerNFT from 0x3e830d88a864b1a0

transaction(playerID: UInt64){

    prepare(acct: AuthAccount){
       PlayerNFT.vote(Player_id: playerID, user: acct.address)
    }
    
    execute{
        log("Voted")
    }

}