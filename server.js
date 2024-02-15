// import mysql2
const mysql = require('mysql2')
// import inquirer 
const inquirer = require('inquirer'); 

// connect to db
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Purple0123!',
      database: 'employees_db'
});

db.connect(err => {
    if (err) throw err;
    console.log(`Connected to the employeess_db database.`);
    promptUser();
});

// inquirer promp for actions
const promptUser = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }])
    .then((answers) => {
        if (answers.prompt === "View All Employees") {
            showEmployees();
        }
        if (answers.prompt === "Add Employee") {
            addEmployee();
        }
        if (answers.prompt === "Update Employee Role") {
            updateEmployee();
        }
        if (answers.prompt === "View All Roles") {
            showRoles();
        }
        if (answers.prompt === "Add Role") {
            addRole();
        }
        if (answers.prompt === "View All Departments") {
            showDepartments();
        }
        if (answers.prompt === "Add Department") {
            addDepartment();
        }
        if (answers.prompt === "Quit") {
            db.end();
            console.log("Bye Bye");
        };
    });
};

// function to show all emps
showEmployees = () => {
    console.log("Showing all employees...\n");
    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err;
        console.table(result);
        promptUser();
    });
};

// function to add emp
addEmployee = () => {
    
    
};

// function to update emp
updateEmployee = () => {
    
    
};

// function to show all roles
showRoles = () => {
    console.log("Showing all roles...\n");
    db.query(`SELECT * FROM role`, (err, result) => {
        if (err) throw err;
        console.table(result);
        promptUser();
    });
};

// function to add a role
addRole = () => {
    
    
};

// function to show all departments
showDepartments = () => {
    console.log("Showing all departments...\n");
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.table(result);
        promptUser();
    });
};

// function to add department
addDepartment = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'addDepartment',
        message: 'What is the new department name?'
    }])
    .then((answer) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answer.addDepartment], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answer.addDepartment} to the database.`);
            showDepartments();
            promptUser();
        });
    });
    
};