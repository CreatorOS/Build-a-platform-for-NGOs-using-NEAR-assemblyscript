import { registerNGO, addProject } from "../assembly";

describe("adding a project", () => {
    it("should add a Project", () => {
        const ngo = registerNGO();
        const project = addProject(ngo, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
        expect(project).toBeTruthy();
    });
})