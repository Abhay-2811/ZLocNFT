import ZLocNFT from 0x3e830d88a864b1a0

transaction(id: UInt64,name: String, home: String, away: String, hi: String, ai: String, tickets: [UInt64]){

    prepare(acct: AuthAccount){
        let minter = acct.borrow<&ZLocNFT.NFTMinter>(from: /storage/Minter)!;
        minter.createMatch(id: id,name: name, home: home, away: away, homeImg: hi, awayImg: ai, tickets: tickets)
        
    }
    
    execute{
        log("Match Created")
    }
}