import { registerNGO, addProject, getProjects } from "../assembly";
import { VMContext} from "near-sdk-as";

describe("getting projects", () => {
  it("should get all the projects", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const ngo = registerNGO();
    const project = addProject(
      ngo,
      "alice.testnet",
      "Book Drive",
      "10000000000000000000000000",
    );
    const project1 = addProject(
      ngo,
      "alice.testnet",
      "Book Drive",
      "10000000000000000000000000",
    );
    const project2 = addProject(
      ngo,
      "alice.testnet",
      "Book Drive",
      "10000000000000000000000000",
    );
    const projects = getProjects(ngo);
    expect(projects).toHaveLength(3);
  });
});
