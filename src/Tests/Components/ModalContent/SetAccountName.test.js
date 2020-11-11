import SetAccountName from "../../../Components/ModalContent/SetAccountName";
import { shallow } from "enzyme";
import React from "react";
import { setGlobal } from "reactn";
import { setGlobalObject } from "./../../../Helpers/global";
import { SUCCESS_SET_ACCOUNT_NAME } from "../../../Constants/Alerts";

jest.mock("../../../Helpers/global", () => ({
  setGlobalObject: jest.fn()
}));

describe("SetAccountName", () => {
  beforeEach(() => {
    setGlobalObject.mockClear();
  });

  it("should have form with 1 field", () => {
    const component = shallow(<SetAccountName />);

    expect(component.find("form")).toHaveLength(1);
    expect(component.find("input")).toHaveLength(1);
    expect(component.find("button")).toHaveLength(1);
  });

  it("should update name when valid name submitted and no error", async () => {
    const expectedName = "John John";
    const authUser = { uid: null, email: "test@test.com" };
    const error = null;

    const updateMock = jest.fn(() => Promise.resolve());
    setGlobal({
      firebase: {
        update: updateMock,
        authUser: authUser
      }
    });

    const component = shallow(<SetAccountName />);

    component.setState({ name: expectedName });

    await component.instance().onSubmit({ preventDefault: () => {} });

    expect(updateMock).toHaveBeenCalledWith({
      "/users/null/name/": "John John"
    });

    expect(setGlobalObject).toHaveBeenCalledWith("modal", "mode", null);
    expect(setGlobalObject).toHaveBeenCalledWith(
      "account",
      "alert",
      SUCCESS_SET_ACCOUNT_NAME
    );
  });

  it("should not update name when valid name submitted and error", async () => {
    const expectedName = "John John";
    const authUser = { uid: null, email: "test@test.com" };
    const updateMock = jest.fn(() => Promise.reject());
    setGlobal({
      firebase: {
        update: updateMock,
        authUser: authUser
      }
    });

    const component = shallow(<SetAccountName />);

    component.setState({ name: expectedName });

    await component.instance().onSubmit({ preventDefault: () => {} });

    expect(updateMock).toHaveBeenCalledWith({
      "/users/null/name/": "John John"
    });

    expect(setGlobalObject).not.toHaveBeenCalledWith(
      "modal",
      "isVisible",
      false
    );
    expect(setGlobalObject).not.toHaveBeenCalledWith("modal", "mode", null);
  });
});
