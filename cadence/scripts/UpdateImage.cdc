import ZLocNFT from 0x01


pub fun main(account: Address): String {

  let publicRef = getAccount(account).getCapability(/public/CollectionPublic)
                                 .borrow<&ZLocNFT.Collection{ZLocNFT.ZlocNFTCollectionPublic}>()
                                 ?? panic("No collection exists in account")
  let token = publicRef.borrowZlocNFT(id: 0)!;
  token.updateImage();
  return token.imgURL
}
