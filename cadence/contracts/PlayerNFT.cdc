import NonFungibleToken from "NonFungibleToken"
import ZLocNFT from "ZLocNFT"

pub contract PlayerNFT: NonFungibleToken{

    pub var totalSupply: UInt64;

    pub event ContractInitialized();
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    access(contract) var votedUsers: [UInt64]

    access(contract) var AMPs: {UInt64: UFix64};

    pub fun getAMP(PNFTid: UInt64): UFix64{
        return self.AMPs[PNFTid] ?? panic("Couldn't find player with given NFT id")
    }

    pub resource NFT: NonFungibleToken.INFT{
        pub let id: UInt64;
        pub let Player_name: String;
        init(
            name: String
        ){
            self.id = PlayerNFT.totalSupply;
            PlayerNFT.totalSupply = PlayerNFT.totalSupply + 1;  
            self.Player_name = name;
        }

        
    }

    pub fun vote(Player_id: UInt64, user: Address){
        pre {
            //check if sender has ZLocNFT so they can vote
            getAccount(user).getCapability(/public/CollectionPublic).borrow<&ZLocNFT.Collection{ZLocNFT.ZlocNFTCollectionPublic}>()!
                            .getIDs().length == 1;

            self.AMPs.containsKey(Player_id) : "Player with id doesn't exist"
            !self.votedUsers.contains(UInt64(getAccount(user).getCapability(/public/CollectionPublic).borrow<&ZLocNFT.Collection{ZLocNFT.ZlocNFTCollectionPublic}>()!
                            .getIDs()[0])) : "User has already voted"
            }
        self.AMPs[Player_id] = self.AMPs[Player_id]! + 0.01;
        self.votedUsers.append(getAccount(user).getCapability(/public/CollectionPublic).borrow<&ZLocNFT.Collection{ZLocNFT.ZlocNFTCollectionPublic}>()!
                            .getIDs()[0])

    }


    pub resource interface PNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowPNFT(id: UInt64): &PlayerNFT.NFT? {
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow ExampleNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    // this resource lives in every account that owns an NFT
    pub resource Collection: PNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic{
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init(){
            self.ownedNFTs <- {}
        }
        
        pub fun deposit(token: @NonFungibleToken.NFT){
            emit Deposit(id: token.id, to: self.owner?.address)
            self.ownedNFTs[token.id] <-! token;
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT{
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT{
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("NFT doesnt exist");
            emit Withdraw(id: token.id, from: self.owner?.address);
            return <- token;
        }

        pub fun getIDs(): [UInt64]{
            return self.ownedNFTs.keys
        }

        pub fun borrowPNFT(id: UInt64): &PlayerNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &PlayerNFT.NFT
            }

            return nil
        }

        destroy(){
            destroy self.ownedNFTs
        }
    }   

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource PNFTMinter{
        pub fun createNFT(name: String): @NFT{
            PlayerNFT.AMPs.insert(key: PlayerNFT.totalSupply,0.0)
            return <- create NFT(name: name);
        }
        
    }

    init(){
        self.totalSupply = 0;
        self.account.save(<- create PNFTMinter(), to: /storage/PlayerNFTMinter);
        emit ContractInitialized();
        self.AMPs = {};
        self.votedUsers = [];
    }

}