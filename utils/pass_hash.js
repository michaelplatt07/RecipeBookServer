const password = 'testPass';

const crypto = require('crypto');
const cipher = crypto.createCipher('aes-128-cbc', 'baseSecret');
var encryptedPass = cipher.update(password, 'utf8', 'hex');
encryptedPass += cipher.final('hex');
console.log(encryptedPass);
