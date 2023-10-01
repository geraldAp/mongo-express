const express = require("express");
const app = express();
const router = express.Router();
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = require("../../controllers/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// instead of creating different http meth we could do this and chain the different http methods
router
  .route("/")
  .get(getAllEmployees)
  //the roles allowed to post
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);
router.route("/:id").get(getEmployee);

module.exports = router;
