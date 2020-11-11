import React from "reactn";
import { setGlobal, getGlobal } from "reactn";
import { shallow } from "enzyme";
import Modal from "../../../Components/Shared/Modal";
import {
  NO_ACCOUNT_NAME,
  NEW_PROJECT,
  NEW_STORY,
  EDIT_STORY
} from "./../../../Constants/Modal";
import SetAccountName from "./../../../Components/ModalContent/SetAccountName";
import NewProject from "./../../../Components/ModalContent/NewProject";
import NewStory from "./../../../Components/ModalContent/NewStory";
import EditStory from "../../../Components/ModalContent/EditStory";

describe("Modal", () => {
  it("should not be visible if mode is null", () => {
    setGlobal({ modal: { mode: null } });

    const component = shallow(<Modal />);
    expect(component.find("#modal").prop("className")).toContain("hidden");
  });

  it("should be visible if mode is set", () => {
    setGlobal({ modal: { mode: "something" } });

    const component = shallow(<Modal />);
    expect(component.find("#modal").prop("className")).not.toContain("hidden");
  });

  it("should display NO_ACCOUNT_NAME component if in that mode", () => {
    setGlobal({ modal: { mode: NO_ACCOUNT_NAME } });

    const component = shallow(<Modal />);

    expect(component.find(SetAccountName)).toHaveLength(1);
  });

  it("should display NEW_PROJECT component if in that mode", () => {
    setGlobal({ modal: { mode: NEW_PROJECT } });

    const component = shallow(<Modal />);

    expect(component.find(NewProject)).toHaveLength(1);
  });

  it("should display NEW_STORY component if in that mode", () => {
    setGlobal({ modal: { mode: NEW_STORY } });

    const component = shallow(<Modal />);

    expect(component.find(NewStory)).toHaveLength(1);
  });

  it("should have cancel button and close modal when clicked", () => {
    setGlobal({ modal: { mode: NEW_STORY } });
    const component = shallow(<Modal />);
    component.find("#close").simulate("click");

    expect(getGlobal().modal.mode).toBe(null);
  });

  it("should have cancel button and close modal when clicked", () => {
    setGlobal({ modal: { mode: EDIT_STORY } });
    const component = shallow(<Modal />);

    expect(component.find(EditStory)).toHaveLength(1);
  });
});
