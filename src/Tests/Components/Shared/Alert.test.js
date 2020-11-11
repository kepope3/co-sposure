import Alert from "../../../Components/Shared/Alert";
import { shallow } from "enzyme";
import React from "react";
import { setGlobal, getGlobal } from "reactn";
import { SUCCESS_NEW_PROJECT } from "./../../../Constants/Alerts";

describe("Alert", () => {
  it("should have alert box", () => {
    setGlobal({ account: { alert: null } });
    const component = shallow(<Alert />);

    expect(component.find("#alert")).toHaveLength(1);
  });

  it("should have hidden class if no message", () => {
    setGlobal({ account: { alert: null } });
    const component = shallow(<Alert />);

    expect(component.find("#alert").prop("className")).toContain("hidden");
  });

  it("should not have hidden class if alert", () => {
    setGlobal({ account: { alert: SUCCESS_NEW_PROJECT } });
    const component = shallow(<Alert />);

    expect(component.find("#alert").prop("className")).not.toContain("hidden");
    expect(component.find("strong").html()).toContain(
      SUCCESS_NEW_PROJECT.heading
    );
    expect(component.find("#alert").html()).toContain(
      SUCCESS_NEW_PROJECT.description
    );
  });

  it("should set alert to null if not null", () => {
    setGlobal({ account: { alert: SUCCESS_NEW_PROJECT } });
    jest.useFakeTimers();
    const component = shallow(<Alert />);

    component.setProps({ account: { alert: SUCCESS_NEW_PROJECT } });
    jest.runAllTimers();
    expect(getGlobal().account.alert).toBe(null);
  });
});
