let sha256 = require('js-sha256');

function GenerateHash(data, salt){    
    let hash = sha256.create(); 
    
    let temp = (salt == undefined) ? data : data + salt;
    let hex = hash.update(temp).hex();

    return hex;
}

module.exports.generateHash = GenerateHash;