// this accepts a lot of parameters if we want it to and we do that with the spread operator
const verifyRoles = (...allowedRoles) => {
  // the middleware function
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    // checking to see if roles array includes the roles from jwt this returns a boolean so same may be true some may be false in the new array created and all we need is one true to allow for accessing the route we are verifying so the chain will try to find the first val that returns true if there is a true it will be good if not it won't
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result)
      res
        .send(401)
        .json({ message: `you are not authorized to perform this action` }); //unauthorized
    // if everything is good proceed
    next();
  };
};

module.exports = verifyRoles;
