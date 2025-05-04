const express = require("express");
const employeesController = require("../../controllers/employeesController");
const router = express.Router();

// * if we want to protect individual routes
// const verifiyJwt = require("../../middleware/verifyJwt");
// then  .get(verifiyJwt, employeesController.getAllEmployees)

// go to middleware - to verify, then go to employees controller

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
