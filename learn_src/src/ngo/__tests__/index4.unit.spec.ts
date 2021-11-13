import { registerNGO, addProject, getProjects } from "../assembly";
describe("getting projects", () => {
  it("should get all the projects", () => {
    const ngo = registerNGO();
    const project = addProject(
      ngo,
      process.env.get("user1"),
      "Book Drive",
      "10000000000000000000000000",
    );
    const project1 = addProject(
      ngo,
      process.env.get("user1"),
      "Book Drive",
      "10000000000000000000000000",
    );
    const project2 = addProject(
      ngo,
      process.env.get("user1"),
      "Book Drive",
      "10000000000000000000000000",
    );
    const projects = getProjects(ngo);
    expect(projects).toHaveLength(3);
  });
});
