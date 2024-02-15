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
            updateEmployeeRole();
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
    // find all roles for emp to be assigned to
    const roleArray = [];
    db.query("SELECT * FROM role", (err, result) => {
    if (err) throw err;

    result.forEach(role => {
      let roleObj = {
        name: role.title,
        value: role.id
      }
      roleArray.push(roleObj);
    });

    // find all managers for emp to be assigned to or null
    const managerArray = [{
        name: 'None',
        value: null
    }];
    db.query("SELECT * FROM employee", (err, result) => {
    if (err) throw err;

    result.forEach(employee => {
      let employeeObj = {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id
      }
      managerArray.push(employeeObj);
    });

    inquirer.prompt([{
        type: 'input',
        name: 'firstName',
        message: 'What is the employees first name?'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'What is the employees last name?'
    },
    {
        type: 'list',
        name: 'empRole',
        message: 'What is the employees role?',
        choices: roleArray
    },
    {
        type: 'list',
        name: 'empManager',
        message: 'Who is the employees manager?',
        choices: managerArray
    }
    ])
    .then((answers) => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, answers.empRole, answers.empManager], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.\n`);
            promptUser();
      });
    });
    });
    });
};

// function to update emp
updateEmployeeRole = () => {
    // find all emps to choose from
    const employeeArray = [];
    db.query("SELECT * FROM employee", (err, result) => {
    if (err) throw err;

    result.forEach(employee => {
        let employeeObj = {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id
        }
    employeeArray.push(employeeObj);
    });

    // find all roles for emp to be assigned to
    const roleArray = [];
    db.query("SELECT * FROM role", (err, result) => {
    if (err) throw err;

    result.forEach(role => {
        let roleObj = {
            name: role.title,
            value: role.id
    }
    roleArray.push(roleObj);
    });

    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'Which employee do you want to update?',
        choices: employeeArray
    },
    {
        type: 'list',
        name: 'empRole',
        message: 'What is the employees new role?',
        choices: roleArray
    }
    ])
    .then((answers) => {
        db.query(`UPDATE employee SET role_id=(?) WHERE id=(?)`, [answers.empRole, answers.employee], (err, result) => {
            if (err) throw err;
            console.log(`Updated employee role.\n`);
            promptUser();
        });
    });
    });
    });
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
    // finds all departments for each department id
    const departmentsArray = [];
    db.query("SELECT * FROM department", (err, result) => {
    if (err) throw err;

    result.forEach(department => {
      let departmentObj = {
        name: department.name,
        value: department.id
      }
      departmentsArray.push(departmentObj);
    });

    inquirer.prompt([{
        type: 'input',
        name: 'roleName',
        message: 'What is the new role name?'
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?'
    },
    {
        type: 'list',
        name: 'roleDepartment',
        message: 'What department does this role belong to?',
        choices: departmentsArray
    }
    ])
    .then((answers) => {
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.roleName, answers.roleSalary, answers.roleDepartment], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.roleName} to the database.\n`);
            promptUser();
      });
    })

    });
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
            console.log(`Added ${answer.addDepartment} to the database.\n`);
            promptUser();
        });
    });
};