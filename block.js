const SHA256 = require("crypto-js/sha256");

const calculateHash = ({ previousHash, timestamp, data, nonce = 1 }) => 
    SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString()

const generateGenesisBlock = () => {
    const block = {
        previousHash: "0",
        timestamp: + new Date(),
        data: "Genesis Block",
    };
    return {
        ...block,
        hash: calculateHash(block)
    }

}

const displayGenesisBlock = () => {
    let genesis = JSON.stringify(generateGenesisBlock())
    document.getElementById("genesis").innerHTML = genesis
}
const hashConstraints = (difficulty, hash) => 
    hash.substr(0, difficulty) === "0".repeat(difficulty)


const nextNonce = (block) => updateHash({...block, nonce: block.nonce + 1})

const updateHash = (block) => { 
    return { ...block, hash: calculateHash(block)}
}


const trampoline = (func) => {
    let result = func.apply(func, ...arguments)
    while(result && typeof(result) === "function") {
        result = result()
    }
    return result
}

const mineBlock = (difficulty, block) => {
    const mine = (block) => {
        const newBlock = nextNonce(block)
        return hashConstraints(difficulty, newBlock.hash)
                ? newBlock
                : () => mine(nextNonce(block))
    }
    return trampoline(mine(nextNonce(block)))
}

const addBlock = (chain, data) => {
    const { hash: previousHash } = chain[chain.length - 1]
    const block                  = { timestamp: + new Date(), data, previousHash, nonce: 0 }
    const newBlock               = mineBlock(4, block)
    return chain.concat(newBlock)

}

  let chain = [generateGenesisBlock()]

  const newBlockData = {
    sender:   "ks829fh28123jhrv9dk9",
    receiver: "ads8d91w29j32er52910",
    amount:   0.0023,
    currency: "ETH"
  }

  const newChain = addBlock(chain, newBlockData)

  console.log(newChain)