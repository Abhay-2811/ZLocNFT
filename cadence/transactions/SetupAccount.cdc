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
