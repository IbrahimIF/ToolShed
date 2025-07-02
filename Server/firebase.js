const admin = require('firebase-admin');

// Make sure your serviceAccountKey.json is secure and not committed to public repo
// Example using a relative path (for local dev, but still use .gitignore for this file)
// const serviceAccount = require('./path/to/your/serviceAccountKey.json');

// PREFERRED: Using an environment variable for the JSON string
// You MUST set the FIREBASE_SERVICE_ACCOUNT_KEY env var in Server/.env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db }; // Export the Firestore instance for use in server.js