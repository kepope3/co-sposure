import { setGlobal } from "reactn";

export default () => {
  setGlobal({ task: { draggedOverTask: null, draggedTask: null } });
};
