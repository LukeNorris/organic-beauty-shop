
import asyncHandler from 'express-async-handler'
import { Client, Config, CheckoutAPI } from "@adyen/api-library";
import os from 'os'
import axios from 'axios'
import { makePayment } from '../utils/terminalPayments.js';



// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
//config.apiKey = process.env.API_KEY;
config.apiKey ="AQEqhmfuXNWTK0Qc+iSRln09qcWYS4RYA4cYCjZ9urIqptLGFAQL194laYf7EMFdWw2+5HzctViMSCJMYAc=-nmuQo1h2D5Gk25CPEpY8UutiIJCxN1k3rpcjY3n0zo0=-Eg$2qmkKKS,<jqkF"
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);




// @desc creates a payment link
// @route POST /api/adyen/paymentlink
// @access Public
const makeTerminalPayment = asyncHandler(async (req, res) => {
  try {
    console.log('tuna',req.body.cart[0].totalPrice)
    const response = await makePayment(req.body.cart[0].totalPrice)
    res.json(response)
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});



// @desc creates a payment link
// @route POST /api/adyen/paymentlink
// @access Public
const paymentLink = asyncHandler(async (req, res) => {
    try {
        console.log('api key', process.env.API_KEY )
      console.log('tuna',req.body)
      const [name, IP] = findIpAddress();
      
      const response = await checkout.paymentLinks({
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        reference: `${Date.now()}`,
        returnUrl: `exp://${IP}:19000/--/?`, // this URL is used when using with Expo in development
        //   returnUrl: "expo.adyendemo://", // use this if deploying as standalone app in production
        amount: {
          value: req.body.grandTotal * 100,
          // value: 2000,
          currency: "EUR",
        },
        description: "Pro Shop Items",
        countryCode: "DE",
        shopperReference: req.body.user._id,
        shopperEmail: req.body.user.email,
        //lineItems: req.body.cart[0]
      });
      res.json(response);
    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
    }
  });
  
// @desc gets payment methods
// @route POST /api/adyen/getPaymentMethods
// @access private
  const getPaymentMethods = asyncHandler(async (req, res) => {
    try {
      const response = await checkout.paymentMethods({
        channel: "Web",
        merchantAccount: process.env.MERCHANT_ACCOUNT,
      });
      res.json(response);
    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
    }
  });


// @desc make a payment
// @route POST /api/adyen/initiatePayment
// @access private
const initiatePayment = asyncHandler(async (req, res) => {
    const currency = findCurrency(req.body.paymentMethod.type);
    const shopperIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  
    const [name, IP] = findIpAddress();
    try {
      // Ideally the data passed here should be computed based on business logic
      const response = await checkout.payments({
        amount: { currency, value: 2000 }, // value is 20€ in minor units
        reference: `${Date.now()}`,
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        // @ts-ignore
        shopperIP,
        channel: "Web",
        additionalData: {
          // @ts-ignore
          allow3DS2: true,
          authorisationType: "PreAuth",
        },
        returnUrl: `exp://${IP}:19000/--/?`, // this URL is used when using with Expo in development
        //   returnUrl: "expo.adyendemo://", // use this if deploying as standalone app in production
        browserInfo: req.body.browserInfo,
        paymentMethod: req.body.paymentMethod,
        billingAddress: req.body.billingAddress,
        origin: req.body.origin,
      });
      res.json(response);
    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
    }
  });


// Handle all redirects from payment type
const handleShopperRedirect = asyncHandler(async (req, res) => {
    // Create the payload for submitting payment details
    const payload = {};
    payload["details"] = req.method === "GET" ? req.query : req.body;
    payload["paymentData"] = req.cookies["paymentData"];
    const originalHost = req.cookies["originalHost"] || "";
  
    try {
      const response = await checkout.paymentsDetails(payload);
      res.clearCookie("paymentData");
      res.clearCookie("originalHost");
      // Conditionally handle different result codes for the shopper
      switch (response.resultCode) {
        case "Authorised":
          res.redirect(`${originalHost}/status/success`);
          break;
        case "Pending":
        case "Received":
          res.redirect(`${originalHost}/status/pending`);
          break;
        case "Refused":
          res.redirect(`${originalHost}/status/failed`);
          break;
        default:
          res.redirect(
            `${originalHost}/status/error?reason=${response.resultCode}`
          );
          break;
      }
    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.redirect(`${originalHost}/status/error?reason=${err.message}`);
    }
  });




  const findIpAddress = () => {
    const ifaces = os.networkInterfaces();
  
    let name = "localhost";
    let ip = "localhost";
  
    Object.keys(ifaces).forEach((ifname) => {
      var alias = 0;
  
      ifaces[ifname].forEach((iface) => {
        if ("IPv4" !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }
  
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          name = ifname + ":" + alias;
          ip = iface.address;
        } else {
          // this interface has only one ipv4 adress
          name = ifname;
          ip = iface.address;
        }
        ++alias;
      });
    });
    return [name, ip];
  };

  export {
    paymentLink,
    getPaymentMethods,
    initiatePayment,
    handleShopperRedirect,
    makeTerminalPayment
  }