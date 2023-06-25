
function getAccessToken() {
  var cache = CacheService.getScriptCache();
  let accessToken = cache.get("access-token")
  if(accessToken){
    return accessToken
  }
  let clientAssertion = signedJWT;
  if(signedJWT === ""){
    clientAssertion = getSignedJWT()
  }
  var body = {
    "grant_type" : "client_credentials",
    "client_assertion_type" : "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    "client_assertion" : clientAssertion
  };
  let payload = []
  for (var prop in body){
    var encodedKey = encodeURIComponent(prop);
    var encodedValue = encodeURIComponent(body[prop]);
    payload.push(encodedKey + "=" + encodedValue);
  }
  payload = payload.join("&");

  // var urlencoded = new URLSearchParams();
  // urlencoded.append("grant_type", "client_credentials");
  // urlencoded.append("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
  // urlencoded.append("client_assertion", clientAssertion);

  var requestOptions = {
    method: 'post',
    contentType: "application/x-www-form-urlencoded",
    headers: {
      "Content-Type" : "application/x-www-form-urlencoded",
      "Cookie" : "NS_ROUTING_VERSION=LAGGING",
      // "redirect": 'follow'
    },
    payload: payload,
    // redirect: 'follow'
  };
    //TODO: add netsuite account id to global.gs
    let response = UrlFetchApp.fetch(`https://${global.netsuiteAccountId}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`, requestOptions).getContentText()
    accessToken = JSON.parse(response).access_token
    cache.put("access-token", accessToken, global.expiryInSeconds); // cache for 25 minutes
    return accessToken
}
