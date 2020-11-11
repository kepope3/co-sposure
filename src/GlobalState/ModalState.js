import { setGlobal } from "reactn";

export default () => {
  setGlobal({
    modal: {
      mode: null,
      isVisible: false
    }
  });
};
