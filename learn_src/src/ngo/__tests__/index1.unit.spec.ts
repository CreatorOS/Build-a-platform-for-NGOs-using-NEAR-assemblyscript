import { registerNGO } from "../assembly"
describe("Register NGO", () => {
    it("should register an NGO using registerNGO()", () => {
        const ngo = registerNGO();
        expect(ngo).toBeTruthy();
    });
})
