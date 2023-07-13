const snarkjs = require('snarkjs')
const express = require('express');
const cors = require('cors');
const bytes32 = require('bytes32')
const fs = require("fs")

const app = express();

app.use(cors());

app.use(express.json());

// LtRange and LoRange is 2D array [from,to]
// InputLoc is 2D array with user's current location, this is private input that generates proof
const PORT = process.env.PORT || 8000;


app.listen(PORT,async()=>{
  console.log("Listening at PORT: ",PORT);
})

/* 
  input body format:
  {
    LtR: [num,num]
    LoR: [num,num]
    loc: [num,num]
  }
*/

app.post('/proof',async(req,res)=>{
  try {

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      { latitudeRange: req.body.LtR, longitudeRange: req.body.LoR, location: req.body.loc },
      'zk_build/InRange_js/InRange.wasm',
      'circuit_0000.zkey'
    );
    const bytes32Proof = bytes32({input: JSON.stringify({proof, publicSignals}),ignoreLength: true}).toString()
    res.status(200).send({proof: bytes32Proof});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message})
  }
})

// formatting bytes32 proof to json proof
app.post('/formattedProof', async(req,res)=>{
    try {
        const inp = req.body.proof;
        res.status(200).send(JSON.parse(bytes32({input: inp})).proof)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
})

//input bytes32 generated above
app.post('/verifyProof',async(req,res)=>{
    try {
        const inp = req.body.proof
        const proof = JSON.parse(bytes32({input: inp})).proof;
        const publicSignals = JSON.parse(bytes32({input: inp})).publicSignals;
        const vKey = JSON.parse(fs.readFileSync("verification_key.json"));
        const zk_res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        if(zk_res === true){
            res.status(200).send("Verification OK !!!")
        }
        else{
            res.status(200).send("Invalid Proof !!1")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
})
