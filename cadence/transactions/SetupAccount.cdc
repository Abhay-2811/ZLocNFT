import ZLocNFT from 0x45e05daf74108ea8
import NonFungibleToken from 0x45e05daf74108ea8

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- ZLocNFT.createEmptyCollection(), to: /storage/Collection);
    acct.link<&ZLocNFT.Collection{NonFungibleToken.CollectionPublic, ZLocNFT.ZlocNFTCollectionPublic}>(/public/CollectionPublic, target: /storage/Collection);
  }

  execute {
    log("Created a collection and stored")
  }
}
