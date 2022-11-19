"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  domain: '"http://localhost:8080"',
  hostname: '"http://localhost:8000"',
  api_hostname: '"http://localhost:8000/api"',
  google_api_key: '"AIzaSyCw9w68R77RDyROQ1CCP2sYP7M6mC93T8M"',
  bing_api_key:
    '"AmcPmmch5LGYYyGgsNaATJE7SHJq5wchexCd7R5LekNMeGWBf-pzmcMzOoOQbfYV"',
  geoapify_key: '"c9a80cbae37c418a9ba3937f14d5b554"',
  api_data: {
    client_id: 2,
    client_secret: '"ZGSRMQl1ifjbKpoHWHxvV67x1GW05f4OsnemzmIQ"',
    grant_type: '"password"',
    username: '""',
    password: '"secret"'
  },
  stripe: {
    publicKey: '"pk_test_llAZazjaDkV4bHu2rUIRFElM"',
    secretKey: '"sk_test_n2mld9QHvedFiICSErSiQ5Va"'
  },
  pusher: {
    appId: '"461111"',
    appKey: '"1b72f9738e463f3bc391"',
    appSecret: '"2590f5f95f61ddd8530a"',
    appCluster: '"eu"'
  },
  currency: '"EUR"',
  appointmentMaxEndDate:
    '"Sun Dec 12 2100 00:00:00 GMT+0100 (W. Europe Standard Time)"'
});
