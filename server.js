require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const employeesRoutes = require("./routes/employees");
const rolesRoutes = require("./routes/roles");
const departmentsRoutes = require("./routes/departments");

// Port to listen to and express
const app = express();
const PORT = process.env.PORT || 3001;

app.use("/employees", employeesRoutes);
app.use("/roles", rolesRoutes);
app.use("/departments", departmentsRoutes);

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

function promptUserForAction() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "Add Employee",
          "View Employees",
          "Update Employee",
          "Delete Employee",
          "Add Role",
          "View Roles",
          "Delete Role",
          "Add Department",
          "View Departments",
          "Delete Department",
        ],
      },
    ])
    .then((answers) => {
      const { action } = answers;
      if (action === "Add Employee") {
        employeeAdd();
      } else if (action === "View Employees") {
        employeeView();
      } else if (action === "Update Employee") {
        employeeUpdate();
      } else if (action === "Delete Employee") {
        employeeDelete();
      } else if (action === "Add Role") {
        roleAdd();
      } else if (action === "View Roles") {
        rolesView();
      } else if (action === "Delete Role") {
        roleDelete();
      } else if (action === "Add Department") {
        departmentAdd();
      } else if (action === "View Departments") {
        departmentView();
      } else if (action === "Delete Department") {
        departmentDelete();
      }
    });
}

// Adding employee
function employeeAdd() {
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
      {
        type: "number",
        name: "salary",
        message: "Enter the employees salary:",
      },
    ])
    .then((answers) => {
      const { firstName, lastName, department, role, salary } = answers;
      const sql =
        "INSERT INTO employees (first_name, last_name, department_id, title, salary) VALUES (?, ?, ?, ?, ?)";
      db.query(
        sql,
        [firstName, lastName, department, role, salary],
        (error, results) => {
          if (error) {
            console.error("Error saving employee to the database:", error);
          } else {
            console.log("Employee added successfully!");
            db.commit((err) => {
              if (err) {
                console.error("Error committing changes:", err);
              } else {
                console.log("Changes committed successfully!");
              }
            });
            employeeView();
            promptUserForAction();
          }
        }
      );
    });
}

// Viewing employees
function employeeView() {
  const query = `
      SELECT employees.id, employees.first_name, employees.last_name, departments.name AS department, roles.title, roles.salary
      FROM employees
      INNER JOIN roles ON employees.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
    `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving employee data from the database:", error);
    } else {
      console.table(results);
      promptUserForAction();
    }
  });
}

// Updating employee
function employeeUpdate() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter the ID of the employee to update:",
      },
      {
        type: "list",
        name: "updateField",
        message: "Select the field to update:",
        choices: ["role", "salary"],
      },
      {
        type: "input",
        name: "updateValue",
        message: "Enter the new value:",
      },
    ])
    .then((answers) => {
      const { employeeId, updateField, updateValue } = answers;

      let query;
      let values;

      if (updateField === "role") {
        query = `UPDATE employees SET role_id = ? WHERE id = ?`;
        values = [updateValue, employeeId];
      } else if (updateField === "salary") {
        query = `UPDATE employees SET salary = ? WHERE id = ?`;
        values = [updateValue, employeeId];
      }

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error updating employee in the database:", error);
        } else {
          console.log("Employee updated successfully!");

          db.commit((err) => {
            if (err) {
              console.error("Error committing changes:", err);
            } else {
              console.log("Changes committed successfully!");
            }
          });

          promptUserForAction();
        }
      });
    });
}

// Deleting employee
function employeeDelete() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter employee ID to delete:",
      },
    ])
    .then((answers) => {
      const { employeeId } = answers;

      const query = `DELETE FROM employees WHERE id = ?`;
      const values = [employeeId];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error deleting employee from the database:", error);
        } else {
          console.log("Employee deleted successfully!");
          promptUserForAction();
        }
      });
    });
}

// Adding role
function roleAdd() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter role title:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter role salary:",
      },
    ])
    .then((answers) => {
      const { title, salary } = answers;

      const query = `INSERT INTO roles (title, salary) VALUES (?, ?)`;
      const values = [title, salary];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error saving role to the database:", error);
        } else {
          console.log("Role added successfully!");
          promptUserForAction();
        }
      });
    });
}

// Viewing roles
function rolesView() {
  const query = "SELECT * FROM roles";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving role data from the database:", error);
    } else {
      console.table(results);
      promptUserForAction();
    }
  });
}

// Deleting role
function roleDelete() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleId",
        message: "Enter role ID to delete:",
      },
    ])
    .then((answers) => {
      const { roleId } = answers;

      const query = `DELETE FROM roles WHERE id = ?`;
      const values = [roleId];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error deleting role from the database:", error);
        } else {
          console.log("Role deleted successfully!");
          promptUserForAction();
        }
      });
    });
}

// Adding department
function departmentAdd() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter department name:",
      },
    ])
    .then((answers) => {
      const { name } = answers;

      const query = `INSERT INTO departments (name) VALUES (?)`;
      const values = [name];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error saving department to the database:", error);
        } else {
          console.log("Department added successfully");
          promptUserForAction();
        }
      });
    });
}

// Viewing departments
function departmentView() {
  const query = "SELECT * FROM departments";

  db.query(query, (error, results) => {
    if (error) {
      console.error(
        "Error retrieving department data from the database:",
        error
      );
    } else {
      console.table(results);
      promptUserForAction();
    }
  });
}

// Deleting department
function departmentDelete() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentId",
        message: "Enter department ID to delete:",
      },
    ])
    .then((answers) => {
      const { departmentId } = answers;

      const query = `DELETE FROM departments WHERE id = ?`;
      const values = [departmentId];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error deleting department from the database:", error);
        } else {
          console.log("Department deleted successfully");
          promptUserForAction();
        }
      });
    });
}

db.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database");
    promptUserForAction();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
