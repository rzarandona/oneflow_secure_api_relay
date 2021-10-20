let express = require("express");
let app = express();
require("dotenv").config();

let crypto = require("crypto-js");
let axios = require("axios");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

let method = "POST";
let path = "/api/order";
let timestamp = Math.floor(Date.now() / 1000);
let secret = process.env.ONEFLOW_SECRET;
let token = process.env.ONEFLOW_TOKEN;

let stringToSign = method + " " + path + " " + timestamp;
let signature = crypto.HmacSHA1(stringToSign, secret).toString(crypto.enc.Hex);
let authHeader = token + ":" + signature;

app.get("/", (req, res, next) => {
  res.send("HELLOWORLD");
});

app.get("/orders", (req, res, next) => {
  axios
    .get("https://pro-api.oneflowcloud.com/api/order", {
      headers: {
        "x-oneflow-authorization": authHeader,
        "x-oneflow-date": timestamp,
      },
    })
    .then((api_response) => {
      console.log(api_response);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/submit_order", (req, res, next) => {
  let order_id = req.body.order_id;
  let inner_pdf = req.body.inner_pdf;
  let outer_pdf = req.body.outer_pdf;

  let data = {
    destination: {
      name: "pureprint",
    },
    orderData: {
      sourceOrderId: order_id,
      customerName: "hectorspost",
      items: [
        {
          barcode: order_id,
          shipmentIndex: 0,
          sourceItemId: order_id,
          sku: "hectorspost_staging",
          quantity: 1,
          unitCost: 0.0,
          components: [
            {
              path: inner_pdf,
              fetch: true,
              localFile: false,
              code: "text",
            },
            {
              path: outer_pdf,
              fetch: true,
              localFile: false,
              code: "cover",
            },
          ],
        },
      ],
      shipments: [
        {
          shipmentIndex: 0,
          shipTo: {
            name: "Test Tester ",
            companyName: "Test Company",
            address1: "Do Not Ship",
            town: "DO NOT SHIP",
            postcode: "1ES TE1",
            isoCountry: "GB",
          },
          shipByDate: "2021-09-09T13:15:25.7654838+01:00",
          canShipEarly: false,
          returnAddress: {
            name: "Test",
            companyName: "Pureprint Group",
            address1: "Beon House, Bellbrook Park",
            town: "Uckfield",
            postcode: "TN22 1PL",
            isoCountry: "GB",
          },
          carrier: {
            alias: "shippingtest",
          },
          dispatchAlert: "",
        },
      ],
      tags: ["0"],
    },
  };

  axios
    .post("https://pro-api.oneflowcloud.com/api/order", data, {
      headers: {
        "x-oneflow-authorization": authHeader,
        Accept: "application/json",
        "x-oneflow-date": timestamp,
      },
    })
    .then((api_response) => {
      console.log(api_response.status);
      if (api_response.status == 200 || api_response.status == 201) {
        res.send({ status: "success" });
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({ status: "failed" });
    });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
