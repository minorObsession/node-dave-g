const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.roles will have the roles of the current user
    if (!req?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRoles];

    console.log(rolesArray);
    console.log(req.roles);

    // this will be an array of booleans, then find any true value
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((value) => value === true);

    if (!result) return res.sendStatus(401);

    next();
  };
};

module.exports = verifyRoles;
