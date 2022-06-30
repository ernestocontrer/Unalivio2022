const { customAlphabet } = require('nanoid');

function generate_UUID(ABC, length) {
    const alphabet = ABC;
    const nanoid = customAlphabet(alphabet, length);   
    let uuid = nanoid().toString();
    var readyId = ''
    for (let i=0; i<uuid.length; i++) {
        readyId = readyId + (uuid[i])
        if (i == 3){
            readyId = readyId + '_'
        }
    }
    console.log(readyId)
    return (uuid = '0' + readyId);
}


module.exports = {
    generate_UUID
}