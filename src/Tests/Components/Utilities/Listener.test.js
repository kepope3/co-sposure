import { shallow } from "enzyme";
import React from "reactn";
import Listener from "../../../Components/Utilities/Listener";
import { setGlobal } from "reactn";
import { setGlobalObject } from "../../../Helpers/global";

jest.mock("../../../Helpers/global", () => ({
  setGlobalObject: jest.fn()
}));

describe("Listener", () => {
  beforeEach(() => {
    setGlobalObject.mockClear();
  });
  describe("getUser", () => {
    it("should get user data from datastore and set global user if snapshot val is defined", () => {
      const expectedUser = { name: "Keith" };
      const setUser = jest.fn();
      const authUser = { uid: null };
      const snapshot = { val: () => expectedUser };
      const getUserMock = jest.fn(uid => ({
        on: (value, callback) => {
          callback(snapshot);
        },
        set: setUser
      }));
      setGlobal({
        firebase: {
          getUser: getUserMock,
          auth: {
            onAuthStateChanged: jest.fn(() => {})
          }
        }
      });

      const component = shallow(<Listener />);
      component.instance().getUser(authUser);

      expect(getUserMock).toHaveBeenCalledWith(authUser.uid);
      expect(setGlobalObject).toHaveBeenCalledWith(
        "account",
        "user",
        expectedUser
      );
    });

    it("should get user data from datastore and set database store user if snapshot val is not defined", () => {
      const authUser = { uid: null, email: "test@test.com" };
      const setUser = jest.fn();
      const snapshot = { val: () => undefined };
      const getUserMock = jest.fn(uid => ({
        on: (value, callback) => {
          callback(snapshot);
        },
        set: setUser
      }));
      setGlobal({
        firebase: {
          getUser: getUserMock,
          auth: {
            onAuthStateChanged: jest.fn(() => {})
          }
        }
      });

      const component = shallow(<Listener />);
      component.instance().getUser(authUser);

      expect(getUserMock).toHaveBeenCalledWith(authUser.uid);
      expect(setUser).toHaveBeenCalledWith({ email: authUser.email });

      expect(setGlobalObject).toHaveBeenCalledWith("account", "user", {
        email: authUser.email
      });
    });
  });
});
