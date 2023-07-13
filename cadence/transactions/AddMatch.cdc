import ZLocNFT from 0x45e05daf74108ea8

transaction(id: UInt64, home: String, away: String, hi: String, ai: String, hwi: String, hli: String, awi: String, ali: String){

    prepare(acct: AuthAccount){
        let minter = acct.borrow<&ZLocNFT.NFTMinter>(from: /storage/Minter)!;
        minter.createMatch(id: id, home: home, away: away, homeImg: hi, awayImg: ai, homeWinUrl: hwi, homeLossUrl: hli, awayWinUrl: awi, awayLossUrl: ali)
        
    }
    
    execute{
        log("Match Created")
    }
}