import { setGlobal } from "reactn";

export default () => {
  setGlobal({
    account: {
      isLoggedIn: false,
      isLoading: true,
      isEmailVerified: false,
      user: null,
      alert: null,
      serverTime: null
    }
  });
};
