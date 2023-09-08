require("dotenv").config();
const express = require('express');
const mysql = require("mysql2");
const inquirer = require("inquirer");

const app = express();
const PORT = process.env.PORT || 3001;

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

const db = mysql.createConnection(
  {
    host: "localhost",
    user: dbUser,
    password: dbPass,
    database: dbName,
  },
  console.log("Connected Successfully!")
);
