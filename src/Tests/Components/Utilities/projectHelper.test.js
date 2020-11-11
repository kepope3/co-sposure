import { daysLeftForSprint } from "../../../Components/Utilities/projectHelper";
import { setGlobal } from "reactn";

describe("dateDiffInDays", () => {
  it("should be three days difference", () => {
    setGlobal({
      projects: { loaded: { sprintLength: 7 } },
      sprints: { currentSprint: { creationDate: 1564237199000 } },
      account: { serverTime: { time: 1564496399000 } }
    });
    const result = daysLeftForSprint();
    expect(result).toBe(4);
  });

  it("should not return less than 0 days", () => {
    setGlobal({
      projects: { loaded: { sprintLength: 7 } },
      sprints: { currentSprint: { creationDate: 1564237199000 } },
      account: { serverTime: { time: 1595747979000 } }
    });
    const result = daysLeftForSprint();
    expect(result).toBe(0);
  });
});
