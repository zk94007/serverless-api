require('dotenv').config({
  path: '.env.local'
});
const { getRecordings, createComposition } = require('../lib/twilio');
const roomId= 'RMe82792e2ee3eead126cd8f9dac01628d';

createComposition(roomId).then(
  r => console.log(r),
  e => console.log(e)
);
