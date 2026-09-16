<h1 align="center">Oneflow Secure API Relay</h1>

<p align="center"><strong>Authenticated API relay middleware for Oneflow integrations.</strong></p>

<p align="center">An Express service that relays API requests with HMAC-SHA1 signing, encryption helpers, CORS support, and environment-based credentials.</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white" alt="Node.js and Express" />
  <img src="https://img.shields.io/badge/Express-4.17-000000?logo=express&logoColor=white" alt="Express 4.17" />
  <img src="https://img.shields.io/badge/Axios-0.23-5A29E4?logo=axios&logoColor=white" alt="Axios 0.23" />
</p>

---

## Overview

Oneflow Secure API Relay provides an HTTP boundary for Oneflow integrations.
It applies request signing, encryption utilities, CORS policy, and environment
configuration before forwarding requests to the external API.

## Tech Stack

| Package | Version | Purpose |
| --- | --- | --- |
| `express` | 4.17.1 | HTTP server and routing. |
| `axios` | 0.23.0 | Outbound API requests. |
| `cors` | 2.8.5 | Cross-origin request controls. |
| `crypto-js` | 4.1.1 | HMAC-SHA1 signing and encryption utilities. |
| `dotenv` | 10.0.0 | Environment-variable loading. |
| `isomorphic-fetch` | 3.0.0 | Fetch API compatibility. |

## Run Locally

```bash
npm install
node app.js
```

Configure credentials with a local `.env` file; do not commit secrets. The
repository has no configured automated test or lint command.