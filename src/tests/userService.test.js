const UserService = require("../domain/services/userService");
const { BadRequestError } = require("../core/exceptions");

describe("UserService", () => {
  it("should throw an error if user is not found", async () => {
    await expect(UserService.getUserById("invalid-id")).rejects.toThrow(
      BadRequestError
    );
  });
});
