interface EmployeeType {
  id: number,
  team_id: number,
  name: string,
  last_name: string,
  document: string,
  birth: string,
  area: string
}

interface AccountType {
  username: string,
  hash: string,
  employee_id: string,
  salt: string,
}


export {
  EmployeeType,
  AccountType
}
