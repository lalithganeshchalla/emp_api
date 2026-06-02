const express = require("express");

const router = express.Router();

const employeeController = require("../controllers/employeeControllers");

router.get("/", employeeController.getAllEmployees);

router.get("/search", employeeController.searchEmployee);

router.post("/", employeeController.createEmployee);

router.put("/:id", employeeController.updateEmployee);

router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;