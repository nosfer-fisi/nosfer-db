import {
  string
} from 'yup'

/**
 * Hashes `password` after appending `salt` to it, only the salt should be stored for posterior validation
 */
const hashPassword = async (password: string, salt: string): Promise<string | undefined>  => {
  const schema = string().oneOf(['bcrypt', 'argon2id', 'argon2d', 'argon2i'])
  const valid_algo_verify = await schema.isValid(process.env.AUTH_HASH)
  if (!valid_algo_verify) {
    return undefined
  }

  const hashingAlgo = await schema.validate(process.env.AUTH_HASH)
  return Bun.password.hash(password + salt, {
    algorithm: hashingAlgo,
  });
}

/**
 * After retrieving the `salt`, this tests the password to see if it matches
 */
const verifyPassword = async (password: string, salt: string) => {
  const schema = string().oneOf(['bcrypt', 'argon2id', 'argon2d', 'argon2i'])
  const valid_algo_verify = await schema.isValid(process.env.AUTH_HASH)
  if (!valid_algo_verify) {
    return undefined
  }

  const hashingAlgo = await schema.validate(process.env.AUTH_HASH)
  return Bun.password.verify(password + salt, hashingAlgo)
}

export {
  hashPassword,
  verifyPassword
}




