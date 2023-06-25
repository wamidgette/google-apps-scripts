//This code provided by NetSuite to generate the signed JWT session token
let signedJWT = "";
function getSignedJWT() {
  try {
    var navigator = {}; // necessary as part of "eval" on jsrsasign lib
    var window = {}; // necessary as part of "eval" on jsrsasign lib
    let jsrsasign = eval(
      UrlFetchApp.fetch(
        "https://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js"
      ).getContentText()
    );

    // Create JWT header
    var jwtHeader = {
      alg: "PS256", // Using PS256, which is one of the algorithms NetSuite supports for client credentials
      typ: "JWT",
      kid: global.credentials.certificateID, // Certificate Id on the client credentials mapping
    };

    let stringifiedJwtHeader = JSON.stringify(jwtHeader);

    // Create JWT payload
    let jwtPayload = {
      iss: global.credentials.consumerKey, // consumer key of integration record
      scope: ["restlets", "rest_webservices"], // scopes specified on integration record
      iat: new Date() / 1000, // timestamp in seconds
      exp: new Date() / 1000 + global.expiryInSeconds, // timestamp in seconds, 1 hour later, which is max for expiration
      aud: `https://${global.netsuiteAccountId}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`,
    };

    var stringifiedJwtPayload = JSON.stringify(jwtPayload);

    // The secret is the private key of the certificate loaded into the client credentials mapping in NetSuite
    let secret = global.credentials.certificateKey;
    let encodedSecret = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(secret)
    ); // we need to base64 encode the key

    // Sign the JWT with the PS256 algorithm (algorithm must match what is specified in JWT header).
    // The JWT is signed using the jsrsasign lib (KJUR)
    signedJWT = KJUR.jws.JWS.sign(
      "PS256",
      stringifiedJwtHeader,
      stringifiedJwtPayload,
      secret
    );

    // The signed JWT is the client assertion (encoded JWT) that is used to retrieve an access token
    // setTimeout(resetSignedJWT,global.expiryInSeconds*1000)
    return signedJWT;
  } catch (err) {
    // TODO (developer) - Handle exception
    Logger.log("Failed with error %s", err.message);
  }
}
