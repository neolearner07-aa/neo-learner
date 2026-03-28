type User = {
  id: string;
  email: string;
  password: string; // hashed password (important)
};

// In-memory database (temporary)
const users: User[] = [];

// Find user by email
export const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};

// Create new user
export const createUser = (user: User) => {
  users.push(user);
  return user;
};

// Export all users (for debugging only)
export const getAllUsers = () => {
  return users;
};