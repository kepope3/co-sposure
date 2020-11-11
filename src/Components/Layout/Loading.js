import React, { Component } from "reactn";
import styles from "../../Assets/CSS/loading.module.css";
import spinner from "../../Assets/Images/Spinner.gif";

export default class Loading extends Component {
  render() {
    return (
      <div
        id="loader"
        className={
          this.global.account.isLoading ? styles.isLoading : styles.isNotLoading
        }
      >
        <img
          className={styles.loadingImg}
          src={spinner}
          alt="spinner"
          height="100"
          width="100"
        />
        {this.props.children}
      </div>
    );
  }
}
