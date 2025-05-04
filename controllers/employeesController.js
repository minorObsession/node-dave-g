const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (newData) {
    this.employees = newData;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  console.log(newEmployee);
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: "First and Last names are required!" });
  }
  data.setEmployees([...data.employees, newEmployee]);
  // console.log(data.employees);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  // find employee in array
  const employee = data.employees.find(
    (e) => +e.id === JSON.parse(req.body.id)
  );
  // if not success
  if (!employee)
    return res
      .status(400)
      .json({ message: `No employee with ID ${req.body.id} was found!` });

  // if success

  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;

  const tempArray = [...data.employees, employee];
  data.setEmployees(tempArray.sort((a, b) => a.id - b.id));

  res.status(201).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (e) => +e.id === +JSON.parse(req.body.id)
  );

  // if not success
  if (!employee)
    return res
      .status(400)
      .json({ message: `No employee with ID ${req.body.id} was found!` });

  const filteredArr = data.employees.filter(
    (e) => +e.id !== +JSON.parse(req.body.id)
  );

  data.setEmployees(filteredArr);

  res.status(201).json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find((e) => +e.id === +req.params.id);

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
