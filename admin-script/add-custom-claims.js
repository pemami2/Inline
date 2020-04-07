/**

This add-custom-claims.js file contains couple of samples to manipulate users and their claims.
The Admin-sdk can **only** be ran from Node js (or other backend server technologies) therefore
don't try to run such code in client code like Angular. 

Install (in the admin-script folder)
---------------------------------
npm install firebase-admin --save

Run (in the admin-script folder)
----------------------------------
# node add-custom-claims.js

You will need to create a service account key from your firebase console!
*/

var admin = require("firebase-admin");

var serviceAccount = require("./your-service-account-key.json");

var defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-site.firebaseio.com"
});

console.log(`default app name ${defaultApp.name}`);

var defaultAuth = admin.auth();
var defaultDatabase = admin.database();

async function grantActiveSubscriptionRole(email) {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && user.customClaims.techSupport === true) {
        return;
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        techSupport: true
    });
}

// Invoke the code to add the techSupport role to the given account 
grantActiveSubscriptionRole('danmincu@gmail.com').then( () =>
 {
        defaultAuth.getUserByEmail("danmincu@gmail.com").then((user)=> {
            console.log(JSON.stringify(user));
        }).then(() => process.exit());
 });