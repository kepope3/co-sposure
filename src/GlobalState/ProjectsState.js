import { setGlobal } from "reactn";

export default () => {
  setGlobal({
    projects: {
      loaded: null,
      list: null
    },
    sprints: {
      currentSprint: null,
      list: null
    }
  });
};
