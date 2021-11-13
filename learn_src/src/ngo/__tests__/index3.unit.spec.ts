import { registerNGO, getNGO } from "../assembly";
describe("getting NGO", () => {
    it("should get all the 3 registered NGOs", () => {
        const ngo = registerNGO();
        const ngo1 = registerNGO();
        const ngo2 = registerNGO();
        const ngoArray = getNGO();
        expect(ngoArray).toHaveLength(3);
    });
})