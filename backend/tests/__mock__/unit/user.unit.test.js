import {
  validateRequiredFields,
  validateUserRole,
  validateUserExists,
} from "../../../src/validators/userValidators.js";

describe("Validation functions", () => {
  describe("validateRequiredFields", () => {
    it("should throw an error if name is missing", () => {
      expect(() =>
        validateRequiredFields({
          name: "",
          email: "test@example.com",
          password: "123",
        })
      ).toThrow(/Missing required fields/);
    });

    it("should throw an error if email is missing", () => {
      expect(() =>
        validateRequiredFields({ name: "John", email: "", password: "123" })
      ).toThrow(/Missing required fields/);
    });

    it("should throw an error if password is missing", () => {
      expect(() =>
        validateRequiredFields({
          name: "John",
          email: "test@example.com",
          password: "",
        })
      ).toThrow(/Missing required fields/);
    });

    it("should not throw an error if all fields are provided", () => {
      expect(() =>
        validateRequiredFields({
          name: "John",
          email: "test@example.com",
          password: "123",
        })
      ).not.toThrow();
    });
  });

  describe("validateUserRole", () => {
    it("should throw an error if role is invalid", () => {
      expect(() => validateUserRole("guest")).toThrow(/Invalid role/);
    });

    it('should not throw an error if role is "user"', () => {
      expect(() => validateUserRole("user")).not.toThrow();
    });

    it('should not throw an error if role is "admin"', () => {
      expect(() => validateUserRole("admin")).not.toThrow();
    });

    it("should not throw an error if role is undefined", () => {
      expect(() => validateUserRole(undefined)).not.toThrow();
    });
  });

  describe("validateUserExists", () => {
    it("should throw 404 error if user is falsy", () => {
      expect(() => validateUserExists(null)).toThrow(/User not found/);
      expect(() => validateUserExists(undefined)).toThrow(/User not found/);
      expect(() => validateUserExists(false)).toThrow(/User not found/);
    });

    it("should throw error with custom message if provided", () => {
      expect(() => validateUserExists(null, "Custom error message")).toThrow(
        /Custom error message/
      );
    });

    it("should not throw if user exists", () => {
      expect(() => validateUserExists({ id: 1, name: "John" })).not.toThrow();
    });
  });
});
