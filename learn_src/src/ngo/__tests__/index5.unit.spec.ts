import { registerNGO, addProject, donate } from "../assembly";
describe("donating", () => {
    it("should return Done", () => {
        const ngo = registerNGO();
        const project = addProject(ngo, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
        const returnValue = donate(ngo, project);
        expect(returnValue).toBe("Done");
    })
})