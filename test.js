const protocolHandler = require('./index.js');

// returns boolean where true = success
const protocolSet = protocolHandler.setAsDefault({
  protocol: ''
});

if (protocolSet) {
  console.log('Everything worked');
} else {
  console.log('There was a problem setting the protocol');
}
