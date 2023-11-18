import * as yup from 'yup'

let employeeSchema = yup.object({
  team_id: yup.number().required().positive().integer(),
  name: yup.string().required(),
  last_name: yup.string().required(),
  document: yup.string().required(),
  birth: yup.date().required(),
  area: yup.string().required(),
})

let diseaseSchema = yup.object({
  name: yup.string().required(),
})


interface AccountType {
  username: string,
  hash: string,
  employee_id: string,
  salt: string,
}

interface DiseaseType {
  id: number,
  name: string,
}


export {
  employeeSchema,
  diseaseSchema,
  DiseaseType,
  AccountType
}
