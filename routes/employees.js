require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const inquirer = require("inquirer");

// Establishing a connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log("Connected Successfully!")
);

router.get("/", (req, res) => {
  const sql = "SELECT * FROM employees";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employees first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employees last name:",
      },
      {
        type: "input",
        name: "department",
        message: "Enter the employees department:",
      },
      {
        type: "input",
        name: "role",
        message: "Enter the employees role:",
      },
    ])
    .then((answers) => {
      const { firstName, lastName } = answers;
      const sql = "INSERT INTO employees (first_name, last_name) VALUES (?, ?)";
      db.query(sql, [firstName, lastName], (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: "Employee added successfully" });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;