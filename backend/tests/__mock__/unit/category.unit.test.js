import { validateCategoryId, validateCategoryName } from "../../../src/validators/categoryValidators.js";

describe("categoryValidator", () => {
  describe("validateCategoryId", () => {
    it("should return a valid number when a valid ID string is passed", () => {
      expect(validateCategoryId("5")).toBe(5);
    });

    it("should return the same number when a valid number is passed", () => {
      expect(validateCategoryId(10)).toBe(10);
    });

    it("should throw error if ID is 0", () => {
      try {
        validateCategoryId(0);
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Invalid ID",
        });
      }
    });

    it("should throw error if ID is negative", () => {
      try {
        validateCategoryId(-3);
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Invalid ID",
        });
      }
    });

    it("should throw error if ID is NaN", () => {
      try {
        validateCategoryId("abc");
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Invalid ID",
        });
      }
    });

    it("should throw error if ID is undefined", () => {
      try {
        validateCategoryId(undefined);
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Invalid ID",
        });
      }
    });
  });

  describe("validateCategoryName", () => {
    it("should return trimmed string when valid name is passed", () => {
      expect(validateCategoryName("  Category Name  ")).toBe("Category Name");
    });

    it("should throw error if name is empty string", () => {
      try {
        validateCategoryName("");
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Name is required",
        });
      }
    });

    it("should throw error if name is string with only spaces", () => {
      try {
        validateCategoryName("   ");
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Name is required",
        });
      }
    });

    it("should throw error if name is undefined", () => {
      try {
        validateCategoryName(undefined);
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Name is required",
        });
      }
    });

    it("should throw error if name is not a string", () => {
      try {
        validateCategoryName(123);
      } catch (error) {
        expect(error).toMatchObject({
          status: 400,
          message: "Name is required",
        });
      }
    });
  });
});
