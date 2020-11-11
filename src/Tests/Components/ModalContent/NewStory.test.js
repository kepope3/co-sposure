import NewStory from "../../../Components/ModalContent/NewStory";
import { shallow } from "enzyme";
import React from "react";
import { setGlobal } from "reactn";

describe("NewStory", () => {
  it("should have a title and a form", () => {
    const component = shallow(<NewStory />);

    expect(component.find("h3")).toHaveLength(1);
    expect(component.find("form")).toHaveLength(1);
  });

  it("should have 4 input fields", () => {
    const component = shallow(<NewStory />);

    expect(component.find("input")).toHaveLength(3);
    expect(component.find("textarea")).toHaveLength(1);
  });

  it("should create new story on submit", () => {
    const updateCallback = obj => {
      return Promise.resolve();
    };
    const updateFunction = jest.fn(updateCallback);

    setGlobal({
      sprints: { currentSprint: { key: "1", stories: [] } },
      firebase: {
        update: updateFunction
      },
      projects: {
        loaded: { key: "2", currentStoryNo: 3 }
      }
    });
    const component = shallow(<NewStory />);

    component.setState({ name: "keith", description: "here we go", points: 3 });

    component.instance().onSubmit({ preventDefault: () => {} });
    expect(updateFunction).toHaveBeenCalledWith({
      "/projects/2/currentStoryNo": 4,
      "/sprints/1/stories": [
        {
          description: "here we go",
          epicName: "",
          id: "s/3",
          name: "keith",
          points: 3
        }
      ]
    });
  });
});
