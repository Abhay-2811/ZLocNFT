import ZLocNFT from 0x45e05daf74108ea8

transaction(id: UInt64, winningTeam: UInt8){
    prepare(acct: AuthAccount){
        let minter = acct.borrow<&ZLocNFT.NFTMinter>(from: /storage/Minter)!;
        minter.updateWinner(id: id, winningTeam: (winningTeam))

    }

    execute{
        log("Winner Updated")
    }
}
