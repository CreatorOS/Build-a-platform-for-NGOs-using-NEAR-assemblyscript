import { registerNGO, addProject } from "../assembly"
describe("NGO project Sad Paths", () => {
    throws("to return the failure of project addition", () => {
        const ngo = registerNGO();
        const project = addProject(50, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
    });

});