import { registerNGO, addProject } from "../assembly";
import { VMContext} from "near-sdk-as";

describe("adding a project", () => {
  it("should add a Project", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const ngo = registerNGO();
    const project = addProject(
      ngo,
      "alice.testnet",
      "Book Drive",
      "10000000000000000000000000",
    );
    expect(project).toBeTruthy();
  });
});
