import { setGlobal } from "reactn";
import { setGlobalObject } from "../../Helpers/global";
import { getGlobal } from "reactn";

describe("global", () => {
  it("should set new property value", () => {
    const expectNewValue = "ONE";
    setGlobal({ test: { one: "one", two: "two" } });
    setGlobalObject("test", "one", expectNewValue);

    expect(getGlobal().test).toMatchObject({ one: expectNewValue, two: "two" });
  });
});
