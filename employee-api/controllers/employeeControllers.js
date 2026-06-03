const fs = require("fs");

const path = require("path");

const FILE_PATH = path.join(__dirname, "../data.json");

// Read data from file
const readEmployees = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write data to file
const writeEmployees = (employees) => {
    fs.writeFileSync(
        FILE_PATH,
        JSON.stringify(employees, null, 2)
    );
};

// Get All Employees
exports.getAllEmployees = (req, res) => {

    const employees = readEmployees();

    res.status(200).json(employees);
};

// Search Employee By Any Field
exports.searchEmployee = (req, res) => {

    const employees = readEmployees();

    const filters = req.query;

    const result = employees.filter(employee =>
        Object.keys(filters).every(
            key =>
                employee[key]?.toString().toLowerCase() ===
                filters[key].toString().toLowerCase()
        )
    );

    res.status(200).json(result);
};

// Create Employee
exports.createEmployee = (req, res) => {

    const employees = readEmployees();

    const { name, department, salary } = req.body;

    if (!name || !department || !salary) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    // 🔥 AUTO ID GENERATION
    const newId = employees.length > 0
    ? Math.max(...employees.map(e => e.id)) + 1
    : 1;

    const newEmployee = {
        id: newId,
        name,
        department,
        salary
    };

    employees.push(newEmployee);

    writeEmployees(employees);

    res.status(201).json({
        message: "Employee created successfully",
        data: newEmployee
    });
};

// Update Employee
exports.updateEmployee = (req, res) => {

    const employees = readEmployees();

    const id = Number(req.params.id);

    const index = employees.findIndex(emp => emp.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    // 🔥 Only update provided fields (safe merge)
    employees[index] = {
        ...employees[index],
        ...req.body
    };

    writeEmployees(employees);

    res.status(200).json({
        message: "Employee updated successfully",
        data: employees[index]
    });
};

// Delete Employee
exports.deleteEmployee = (req, res) => {

    const employees = readEmployees();

    const updatedEmployees = employees.filter(
        emp => emp.id != req.params.id
    );

    writeEmployees(updatedEmployees);

    res.status(200).json({
        message: "Employee deleted successfully"
    });
};