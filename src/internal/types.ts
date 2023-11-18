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

let donationSchema = yup.object({
  person_id: yup.number().required().positive().integer(),
  employee_id: yup.number().required().positive().integer(),
  unit_id: yup.number().required().positive().integer(),
  date: yup.date().required(),
})

let laboratorySchema = yup.object({
  employee_id: yup.number().required().positive().integer(),
})

let medicalExamSchema = yup.object({
  person_id: yup.number().required().positive().integer(),
  employee_id: yup.number().required().positive().integer(),
  date: yup.date().required(),
  result: yup.boolean().required(),
})

let personSchema = yup.object({
  name: yup.string().required(),
  last_name: yup.string().required(),
  document: yup.string().required(),
  birth: yup.date().required(),
  blood_type: yup.string().required(),
  state: yup.boolean().required(),
  last_donation: yup.date().required(),
})

let qualityControlSchema = yup.object({
  unit_id: yup.number().required().positive().integer(),
  employee_id: yup.number().required().positive().integer(),
  disease_id: yup.number().required().positive().integer(),
  date: yup.date().required(),
  result: yup.boolean().required(),
})

let requestSchema = yup.object({
  requesting_employee_id: yup.number().required().positive().integer(),
  receiving_employee_id: yup.number().required().positive().integer(),
  unit_id: yup.number().required().positive().integer(),
  reason: yup.string().required(),
  date: yup.date().required(),
})

let storageSchema = yup.object({
  unit_id: yup.number().required().positive().integer(),
})

let unitSchema = yup.object({
  storage_id: yup.number().required().positive().integer(),
  donation_id: yup.number().required().positive().integer(),
  control_id: yup.number().required().positive().integer(),
  expiry_date: yup.date().required(),
  validity_status: yup.boolean().required(),
})


export {
  employeeSchema,
  diseaseSchema,
  donationSchema,
  laboratorySchema,
  medicalExamSchema,
  personSchema,
  qualityControlSchema,
  requestSchema,
  storageSchema,
  unitSchema, 
}
