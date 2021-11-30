import { registerNGO, addProject, donate } from "../assembly";
import { VMContext} from "near-sdk-as";

describe("donating", () => {
  it("should return Done", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const ngo = registerNGO();
    const project = addProject(
      ngo,
      "alice.testnet",
      "Book Drive",
      "10000000000000000000000000",
    );
    const returnValue = donate(ngo, project);
    expect(returnValue).toBe("Done");
  });
});
