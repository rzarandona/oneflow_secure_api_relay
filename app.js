let express = require("express");
let app = express();
let cors = require("cors");
require("dotenv").config();

let crypto = require("crypto-js");
let axios = require("axios");

app.use(cors());

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
  res.json("HELLO WORLD");
});

app.get("/orders", (req, res, next) => {
  axios
    .get("https://pro-api.oneflowcloud.com/api/order", {
      headers: {
        "x-oneflow-authorization": authHeader,
        accept: "application/json",
        "x-oneflow-date": timestamp,
      },
    })
    .then((api_response) => {
      res.json(api_response);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/submit_order", (req, res, next) => {
  let order_id = req.body.order_id;
  let inner_pdf = req.body.inner_pdf;
  let outer_pdf = req.body.outer_pdf;

  let customer_name = req.body.customer_name; //
  let town = req.body.town; //
  let postcode = req.body.postcode; //
  let iso_country = req.body.iso_country; //
  let shipping_alias = req.body.shipping_alias; //
  let sku = req.body.sku;
  let unit_cost = req.body.unit_cost; //
  let address_line = req.body.address_line; //

  let data = {
    destination: {
      name: "pureprint",
    },
    orderData: {
      sourceOrderId: order_id,
      customerName: customer_name /* customer_name */,
      items: [
        {
          barcode: order_id,
          shipmentIndex: 0,
          sourceItemId: order_id,
          sku: sku /* sku */ /* hectorspost_hardback_210x210 | hectorspost_softback_210x210 */,
          quantity: 1,
          unitCost: 0.0 /* unit_cost */,
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
            name: customer_name /* customer_name */,
            companyName: "",
            address1: address_line /* address_line */,
            town: town /* town */,
            postcode: postcode /* postcode */,
            isoCountry: iso_country /* iso_country */,
          },
          shipByDate: "2021-09-09T13:15:25.7654838+01:00",
          canShipEarly: false,
          returnAddress: {
            name: "Hector's Post",
            companyName: "Pureprint Group",
            address1: "Beon House, Bellbrook Park",
            town: "Uckfield",
            postcode: "TN22 1PL",
            isoCountry: "GB",
          },
          carrier: {
            alias:
              shipping_alias /* shipping_alias */ /* rmsigned24uk | rmsigned48uk | rmtrackedeu | rmtrackedrow */,
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
      // console.log(err);
      console.log(err);
      res.send({ status: "failed" });
    });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
