const { customAlphabet } = require('nanoid');

function generate_UUID(ABC, length) {
    const alphabet = ABC;
    const nanoid = customAlphabet(alphabet, length);
    let uuid = nanoid().toString().split('');
    uuid = uuid.splice(4, 0, '_0');

    return (uuid = '0' + uuid.join(''));
}


module.exports = {
    generate_UUID
}
