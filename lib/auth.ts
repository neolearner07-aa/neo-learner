import bcrypt from "bcryptjs";

// Hash password
export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const verifyPassword = async (
  inputPassword: string,
  storedPassword: string
) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};