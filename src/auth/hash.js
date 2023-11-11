/**
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<boolean>}
 */
const hashPassword = async (password, salt) => {
  return Bun.password.hash(password + salt, {
    algorithm: "argon2id",
  });
}

/**
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (password, salt) => {
  return Bun.password.verify(password + salt, hash)
}

export {
  hashPassword,
  verifyPassword
}




