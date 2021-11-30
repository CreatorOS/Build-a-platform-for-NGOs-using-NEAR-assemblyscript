import { registerNGO, addProject } from "../assembly";
import { VMContext} from "near-sdk-as";

describe("NGO project Sad Paths", () => {
  throws("to return the failure of project addition", () => {
    VMContext.setSigner_account_id("alice.testnet");
    const ngo = registerNGO();
    const project = addProject(
      50,
      "alice.testnet",
      "Book Drive",
      "10000000000000000000000000",
    );
  });
});
