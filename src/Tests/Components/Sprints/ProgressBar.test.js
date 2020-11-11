import ProgressBar from "../../../Components/Sprints/ProgressBar";
import { shallow } from "enzyme";
import React from "react";

describe("Progress Bar", () => {
  const component = shallow(
    <ProgressBar
      stories={[
        { isComplete: false, points: 5 },
        { isComplete: true, points: 3 }
      ]}
    />
  );
  it("should have bar", () => {
    expect(component.find(".progress")).toHaveLength(1);
  });
  it("should display total points", () => {
    expect(component.find("#totalPoints").html()).toContain(8);
  });

  it("should display done and in progress points", () => {
    expect(component.find(".bg-success").prop("style")).toMatchObject({
      width: "37.5%"
    });
    expect(component.find(".bg-warning").prop("style")).toMatchObject({
      width: "62.5%"
    });
  });
});
