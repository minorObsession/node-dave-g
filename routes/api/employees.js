const express = require("express");
const employeesController = require("../../controllers/employeesController");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;

// * NOTE: if we want to protect individual routes
// const verifiyJwt = require("../../middleware/verifyJwt");
// then  .get(verifiyJwt, employeesController.getAllEmployees)

// go to middleware - to verify, then go to employees controller
