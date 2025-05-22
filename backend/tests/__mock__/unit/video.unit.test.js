import {
  validateVideoId,
  validateVideoPayload,
} from "../../../src/validators/videoValidators";

describe("validateVideoId", () => {
  it("should return the parsed number when a valid ID is provided", () => {
    expect(validateVideoId("5")).toBe(5);
    expect(validateVideoId(10)).toBe(10);
  });

  it("should throw an error for non-numeric ID", () => {
    expect(() => validateVideoId("abc")).toThrow("Invalid video ID");
    expect(() => validateVideoId(null)).toThrow("Invalid video ID");
    expect(() => validateVideoId(undefined)).toThrow("Invalid video ID");
    expect(() => validateVideoId("")).toThrow("Invalid video ID");
  });

  it("should throw an error for negative or zero ID", () => {
    expect(() => validateVideoId("-1")).toThrow("Invalid video ID");
    expect(() => validateVideoId("0")).toThrow("Invalid video ID");
  });
});

describe("validateVideoPayload", () => {
  it("should not throw when a valid payload is provided", () => {
    const payload = {
      title: "Test Video",
      url: "http://example.com/video",
      categoryId: 1,
    };
    expect(() => validateVideoPayload(payload)).not.toThrow();
  });

  it("should throw error if title is missing or not a string", () => {
    expect(() =>
      validateVideoPayload({ url: "http://url", categoryId: 2 })
    ).toThrow("Title is required and must be a string");

    expect(() =>
      validateVideoPayload({ title: 123, url: "http://url", categoryId: 2 })
    ).toThrow("Title is required and must be a string");
  });

  it("should throw error if url is missing or not a string", () => {
    expect(() =>
      validateVideoPayload({ title: "Test", categoryId: 2 })
    ).toThrow("URL is required and must be a string");

    expect(() =>
      validateVideoPayload({ title: "Test", url: 12345, categoryId: 2 })
    ).toThrow("URL is required and must be a string");
  });

  it("should throw error if categoryId is missing or not a number", () => {
    expect(() =>
      validateVideoPayload({ title: "Test", url: "http://url" })
    ).toThrow("Category ID is required and must be a number");

    expect(() =>
      validateVideoPayload({
        title: "Test",
        url: "http://url",
        categoryId: "abc",
      })
    ).toThrow("Category ID is required and must be a number");
  });

  it("should throw multiple errors if multiple fields are invalid", () => {
    expect(() =>
      validateVideoPayload({ title: 123, url: 456, categoryId: "xyz" })
    ).toThrow(/Title is required.*URL is required.*Category ID is required/);
  });
});
