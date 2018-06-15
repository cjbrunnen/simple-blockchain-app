const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [ this.createGenesisBlock() ];
    }
    createGenesisBlock(){
        return new Block(0, "01/01/2018", "Genesis Block", 0);
    }
    getLatestBlock(){
        return this.chain[ this.chain.length -1 ];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    
    isChainValid(){
        for(let i = 1; i < this.chain.length; i ++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i -1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let valleyCoin = new Blockchain;
valleyCoin.addBlock(new Block(1, "10/06/2018", { amount: 10 }));
valleyCoin.addBlock(new Block(2, "15/06/2018", { amount: 20 }));

// To see the Blockchain, uncomment this line below:
console.log(JSON.stringify(valleyCoin, null, 4));

// To tamper with and test the validity of the chain, uncomment the lines below:
console.log('Is chain valid? ' + valleyCoin.isChainValid());

valleyCoin.chain[1].data = { amount: 100 };
console.log('Is chain valid? ' + valleyCoin.isChainValid());

valleyCoin.chain[1].data = { amount: 100 };
valleyCoin.chain[1].hash = valleyCoin.chain[1].calculateHash();
console.log('Is chain valid? ' + valleyCoin.isChainValid());