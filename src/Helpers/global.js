import { setGlobal, getGlobal } from "reactn";
export const setGlobalObject = (key, property, newValue) => {
  setGlobal({
    [key]: Object.assign({}, getGlobal()[key], { [property]: newValue })
  });
};
