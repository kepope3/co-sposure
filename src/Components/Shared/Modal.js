import React, { Component } from "reactn";
import styles from "../../Assets/CSS/modal.module.css";
import SetAccountName from "../ModalContent/SetAccountName";
import {
  NO_ACCOUNT_NAME,
  NEW_PROJECT,
  NEW_STORY,
  EDIT_STORY
} from "./../../Constants/Modal";
import NewProject from "../ModalContent/NewProject";
import NewStory from "./../ModalContent/NewStory";
import { setGlobalObject } from "./../../Helpers/global";
import EditStory from "../ModalContent/EditStory";

export default class Modal extends Component {
  mainContent = () => {
    const modalMode = this.global.modal.mode;

    if (modalMode === NO_ACCOUNT_NAME) {
      return <SetAccountName />;
    } else if (modalMode === NEW_PROJECT) {
      return <NewProject />;
    } else if (modalMode === NEW_STORY) {
      return <NewStory />;
    } else if (modalMode === EDIT_STORY) {
      return <EditStory />;
    }
  };

  render() {
    return (
      <div
        id="modal"
        className={
          this.global.modal.mode !== null ? "row" : "row " + styles.hidden
        }
      >
        <div className={styles.modal + " col-10 offset-1"}>
          <i
            id="close"
            className={"fa fa-times " + styles.close}
            onClick={() => {
              setGlobalObject("modal", "mode", null);
            }}
          />
          {this.mainContent()}
        </div>
      </div>
    );
  }
}
