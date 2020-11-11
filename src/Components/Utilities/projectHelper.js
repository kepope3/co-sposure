//test
import { getGlobal } from "reactn";
import { BACKLOG } from "./../ModalContent/NewProject";
export const addNewSprint = (projectKey, uid, sprintNo) => {
  let member = {};
  member[uid] = uid;

  const newSprintKey = getGlobal().firebase.getSprints.push().key;
  const members =
    getGlobal().sprints.currentSprint &&
    getGlobal().sprints.currentSprint.members
      ? getGlobal().sprints.currentSprint.members
      : member;

  const sprintNumber = sprintNo
    ? sprintNo
    : getGlobal().projects.loaded.currentSprintNo + 1;
  var updates = {};
  const sprintName =
    sprintNumber === BACKLOG ? BACKLOG : `Sprint ${sprintNumber}`;
  updates[`/sprints/${newSprintKey}/members`] = members;
  updates[
    `/sprints/${newSprintKey}/creationDate`
  ] = getGlobal().firebase.getServerTime;
  updates[`/sprints/${newSprintKey}/name`] = sprintName;

  if (sprintNumber !== BACKLOG)
    updates[`/projects/${projectKey}/currentSprintNo`] = sprintNumber;

  updates[`/projects/${projectKey}/sprints/${newSprintKey}`] = sprintName;

  return updates;
};

export const daysLeftForSprint = function() {
  const sprintLengths =
    getGlobal().projects &&
    getGlobal().projects.loaded &&
    getGlobal().projects.loaded.sprintLength;
  const creationDate =
    getGlobal().sprints &&
    getGlobal().sprints.currentSprint &&
    getGlobal().sprints.currentSprint.creationDate;
  const serverTime =
    getGlobal().account &&
    getGlobal().account.serverTime &&
    getGlobal().account.serverTime.time;
  const dt1 = new Date(creationDate);
  const dt2 = new Date(serverTime);

  const result =
    sprintLengths -
    Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );

  return result < 0 ? 0 : result;
};
