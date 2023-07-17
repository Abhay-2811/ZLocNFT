import ZLocNFT from 0xcb20cd1f08decd61

pub fun main(account: Address): String{
    let publicRef = getAccount(account).getCapability(/public/CollectionPublic)
                                 .borrow<&ZLocNFT.Collection{ZLocNFT.ZlocNFTCollectionPublic}>()
                                 ?? panic("No collection exists in account")
    let token = publicRef.borrowZlocNFT(id: 0)!;

    return token.imgURL;

}