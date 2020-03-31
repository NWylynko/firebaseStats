const admin = require('firebase-admin');

const initApp = (name, ServiceAccountJson, databaseURL) => {
  return admin.initializeApp({ credential: admin.credential.cert(require(ServiceAccountJson)), databaseURL }, name);
  
}

exports.initApp = initApp;