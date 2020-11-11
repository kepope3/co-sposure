import React, { Component } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";
import styles from "./../../Assets/CSS/alert.module.css";

export default class Alert extends Component {
  componentDidUpdate() {
    if (this.global.account.alert !== null) {
      setTimeout(() => setGlobalObject("account", "alert", null), 1300);
    }
  }

  render() {
    const alert = this.global.account.alert;
    return (
      <div
        className={
          alert
            ? alert.class + " " + styles.alertStyles
            : [styles.alertStyles, styles.hidden].join(" ")
        }
        id="alert"
      >
        <strong>{alert && alert.heading}</strong> {alert && alert.description}
      </div>
    );
  }
}
