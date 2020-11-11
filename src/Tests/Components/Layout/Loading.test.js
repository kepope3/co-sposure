import { shallow } from "enzyme";
import Loading from "./../../../Components/Layout/Loading";
import React from "reactn";
import { setGlobal } from "reactn";

describe("Loading", () => {
  it("should have isLoading class if loading", () => {
    setGlobal({ account: { isLoading: true } });
    const component = shallow(<Loading />);

    expect(component.filter("#loader").prop("className")).toContain(
      "isLoading"
    );
  });

  it("should have isNotLoading class if not loading", () => {
    setGlobal({ account: { isLoading: false } });
    const component = shallow(<Loading />);

    expect(component.filter("#loader").prop("className")).toContain(
      "isNotLoading"
    );
  });

  it("should render children", () => {
    const children = <div id="ya" />;
    const component = shallow(<Loading>{children}</Loading>);

    expect(component.find("#ya")).toHaveLength(1);
  });

  it("should have loading image", () => {
    const component = shallow(<Loading />);

    expect(component.find("img")).toHaveLength(1);
  });
});
