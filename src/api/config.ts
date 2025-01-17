import * as dotenv from "dotenv";

let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `.env.test`;
    break;
  case "production":
    path = `.env.production`;
    break;
  default:
    path = `.env.development`;
}
dotenv.config({
  path: path
});

console.log("Loading env: ", path);

let obj = process.env;
let pattern = "VUE_APP_";

export const VUE_APP: any = Object.keys(obj)
  .filter(k => k.includes(pattern))
  .reduce((cur, key) => {
    return Object.assign(cur, {
      [key]: obj[key]
    });
  }, {});

export const API_PORT = parseInt(process.env.API_PORT || "3000");
export const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:8080";
export const AUTH_REDIRECT = process.env.AUTH_REDIRECT || process.env.FRONTEND_URL || "";
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "";
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "";
export const NODE_ENV = process.env.NODE_ENV;

export const DB_NAME = process.env.DB_NAME || "";
export const DB_USER = process.env.DB_USER || "";
export const DB_PASS = process.env.DB_PASS || "";
export const DB_HOST = process.env.DB_HOST || "";
export const DB_PORT = process.env.DB_PORT || "1433";

export const AZURE_KEY = process.env.AZURE_KEY || "";

export const DB_CONFIG = {
  client: "postgres",
  connection: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "",
    port: parseInt(process.env.DB_PORT || "1433")
  }
};

export const TRAVCOM_DB_CONFIG = {
  client: "mssql",
  connection: {
    host: process.env.TRAVCOM_DB_HOST || "",
    user: process.env.TRAVCOM_DB_USER || "",
    password: process.env.TRAVCOM_DB_PASS || "",
    database: process.env.TRAVCOM_DB_NAME || "",
    port: parseInt(process.env.TRAVCOM_DB_PORT || "1433")
  }
};
