import { registerNGO, addProject } from "../assembly";

describe("adding a project", () => {
  it("should add a Project", () => {
    const ngo = registerNGO();
    const project = addProject(
      ngo,
      process.env.get("user1"),
      "Book Drive",
      "10000000000000000000000000",
    );
    expect(project).toBeTruthy();
  });
});
