//  empty object to put the data in
const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) res.status(204).json({ message: `no employees found` });
  res.json(employees);
};
const createNewEmployee = async (req, res) => {
  // the post request
  if (!req?.body?.firstname || !req?.body?.lastname || !req.body?.email) {
    return res.status(400).json({ message: `All fields are requires` });
  }
  const { firstname, lastname, email } = req.body;

  try {
    const result = await Employee.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};
const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `provide id` });
  }
  // finding the employee
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  // checking to see if the employee is found
  if (!employee) {
    return res
      .status(400)
      .json({ message: `no employee with id ${req.body.id}` });
  }

  // doing the update
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `provide id` });
  }
  // finding the employee
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  // checking to see if the employee is found
  if (!employee) {
    return res
      .status(400)
      .json({ message: `no employee with id ${req.body.id}` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};
const getEmployee = async (req, res) => {
  if (req?.params?.id) {
    return res.status(400).json({ message: `provide id` });
  }
  const id = req.params.id;
  const employee = await Employee.findOne({ _id: id }).exec();
  // checking to see if the employee is found
  if (!employee) {
    return res
      .status(400)
      .json({ message: `no employee with id ${id}` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
