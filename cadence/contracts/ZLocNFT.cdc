import NonFungibleToken from "NonFungibleToken"


pub contract ZLocNFT: NonFungibleToken{

    pub var totalSupply: UInt64;

    pub struct match {
        pub let matchID: UInt64;
        pub let matchName: String
        pub let homeTeam: String;
        pub let awayTeam: String;
        pub let homeImgURL: String;
        pub let awayImgURL: String;
        // 0 -> homeTeam, 1 or Positive -> awayTeam, -1 or negative -> YTD
        pub var winningTeam: Int8;

        init(id: UInt64, name: String, home: String, away: String, homeUrl: String, awayUrl: String){
            self.matchID = id;
            self.matchName = name;
            
            self.homeTeam = home;
            self.awayTeam = away;

            self.homeImgURL = homeUrl;
            self.awayImgURL = awayUrl;
            self.winningTeam = -1;

        }

        access(contract) fun updateWinner(winningTeam: UInt8){
            self.winningTeam = Int8(winningTeam);
        }

    }

    // 1 contract, multiple matches. So matchID is required. Every NFT contains matchID embeded in them for clarity and relevance
    pub var matchIDs: {UInt64: match};

 
    //nft id to zk proof: proof form Bytes32
    pub var nftZKProof: {UInt64: String};

    // tickets allowed to mint in match: matchid to tickets array
    access(contract) var tickets: {UInt64: [UInt64]}


    pub event ContractInitialized();
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub resource NFT: NonFungibleToken.INFT{
        pub let id: UInt64;
        pub let name: String;
        pub let matchID: UInt64;
        // which team user is supporting 0 -> home, +ve -> away
        pub let team: UInt8;
        pub var imgURL: String;

        init(
            matchID: UInt64,
            team: UInt8
        ){
            pre {
                (ZLocNFT.matchIDs.containsKey(matchID)) : "First add match ID then create NFT for that match"
            }
            self.id = ZLocNFT.totalSupply;
            ZLocNFT.totalSupply = ZLocNFT.totalSupply + 1;
            self.name = ZLocNFT.matchIDs[matchID]!.matchName;
            self.matchID = matchID;
            self.team = team;
            if(self.team == 0){
                self.imgURL = (ZLocNFT.matchIDs[self.matchID]?.homeImgURL)!
            }
            else {
                self.imgURL = (ZLocNFT.matchIDs[self.matchID]?.awayImgURL)!
            }
            
        }
    }


    pub resource interface ZlocNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowZlocNFT(id: UInt64): &ZLocNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow ExampleNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    // this resource lives in every account that owns an NFT
    pub resource Collection: ZlocNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic{
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init(){
            self.ownedNFTs <- {}
        }

        pub fun deposit(token: @NonFungibleToken.NFT){
            pre {
                self.ownedNFTs.length <= 1 : "Cant Mint more than 1 NFT for user"
            }
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

        pub fun borrowZlocNFT(id: UInt64): &ZLocNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &ZLocNFT.NFT
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

    pub resource NFTMinter{
        pub fun createNFT(matchID: UInt64, team: UInt8, zk: String, ticket: UInt64): @NFT{
            pre {
                ZLocNFT.tickets[matchID]!.contains(ticket): "Cannot mint for given ticket"
            }
            ZLocNFT.nftZKProof.insert(key: ZLocNFT.totalSupply, zk)
            return <- create NFT(matchID: matchID, team: team);
        }

        // update winner of match, 0-> Home, 1 or +ve -> Away
        pub fun updateWinner(id: UInt64, winningTeam: UInt8){
            pre {
                ZLocNFT.matchIDs[id] != nil : "No match found for given match id"
                (ZLocNFT.matchIDs[id]?.winningTeam)! < 0 : "Winner has already been updated";
            }
            (ZLocNFT.matchIDs[id]?.updateWinner(winningTeam: winningTeam))!
        }
            // create a new match
        pub fun createMatch(
            id: UInt64,
            name: String,
            home: String,
            away: String,
            homeImg: String,
            awayImg: String, 
            tickets: [UInt64]
        )  {
            ZLocNFT.matchIDs[id] = ZLocNFT.match(id, name, home, away, homeImg, awayImg);
            ZLocNFT.tickets[id] = tickets;
         }
    }


    init(){
        self.totalSupply = 0;
        self.matchIDs= {};
        self.account.save(<- create NFTMinter(), to: /storage/Minter);
        emit ContractInitialized();
        self.nftZKProof = {}
        self.tickets = {}
    }

}