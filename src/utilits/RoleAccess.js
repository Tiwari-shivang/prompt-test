import rules from "./rules";

const RoleAccess = (role, action, data) => {
  // return true;
  const permissions = rules[role];

  if (!permissions) {
    // role is not present in the rules
    return false;
  }
  
  if (permissions.includes(action)) {
    // static rule not provided for action
    return true;
  };

  return false;
};

export default RoleAccess;