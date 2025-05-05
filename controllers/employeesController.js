const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find(); // returns all employees
  if (!employees)
    return res.status(204).json({ message: "No employees found " });

  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  // find employee in array

  if (!req?.body?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }

  const employee = await Employee.findOne({
    _id: req.body.id,
  }).exec();

  // if not success
  if (!employee)
    return res
      .status(204)
      .json({ message: `No employee matches ${req.body.id}` });

  // if success

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();

  res.status(201).json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }

  const employee = await Employee.findOne({
    _id: req.body.id,
  }).exec();

  // if not success
  if (!employee)
    return res
      .status(204)
      .json({ message: `No employee matches ${req.body.id}` });

  const result = await employee.deleteOne({ _id: req.body.id });

  res.status(201).json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }

  const employee = await Employee.findOne({
    _id: req.params.id,
  }).exec();

  // if not success
  if (!employee)
    return res
      .status(400)
      .json({ message: `No employee with ID ${req.params.id} was found!` });

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
