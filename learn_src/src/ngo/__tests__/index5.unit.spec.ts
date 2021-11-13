import { registerNGO, addProject, donate } from "../assembly";
describe("donating", () => {
  it("should return Done", () => {
    const ngo = registerNGO();
    const project = addProject(
      ngo,
      process.env.get("user1"),
      "Book Drive",
      "10000000000000000000000000",
    );
    const returnValue = donate(ngo, project);
    expect(returnValue).toBe("Done");
  });
});
