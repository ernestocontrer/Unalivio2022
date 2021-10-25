 const { customAlphabet } = require('nanoid');

 let generateUuid = (ABC: string, length: number) => {
 	const alphabet = ABC;
 	const nanoid = customAlphabet(alphabet, length);
 	let uuid = nanoid().toString().split('');
 	uuid.splice(4, 0, '_0');
 	return (uuid = '0' + uuid.join(''));
 };

 export default generateUuid;
