const UserRepository = require("../domain/repositories/userRepository");

const userRepository = new UserRepository();

const seedUsers = async () => {
  await userRepository.create({
    name: "Admin",
    email: "admin@example.com",
    password: "password",
  });
  console.log("Users seeded successfully");
};

seedUsers();
