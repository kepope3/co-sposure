import React, { Component } from "reactn";
import { setGlobalObject } from "./../../Helpers/global";
import { SUCCESS_SET_ACCOUNT_NAME } from "../../Constants/Alerts";
const NameLengthError =
  "name has to be between five and twenty characters in length";
const INITIAL_STATE = {
  name: "",
  error: { message: NameLengthError }
};

export default class SetAccountName extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value.length > 4 && event.target.value.length < 21)
      this.setState({ error: null });
    else this.setState({ error: { message: NameLengthError } });
  };

  onSubmit = event => {
    event.preventDefault();

    const uid = this.global.firebase.authUser.uid;

    var updates = {};
    updates["/users/" + uid + "/name/"] = this.state.name;

    this.global.firebase.update(updates).then(() => {
      setGlobalObject("modal", "mode", null);
      setGlobalObject("account", "alert", SUCCESS_SET_ACCOUNT_NAME);
    });
  };

  render() {
    const { name, error } = this.state;
    const isInvalid = name.length < 5 || name.length > 20;
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit}>
          <h3>Set account name</h3>
          <div className="form-group">
            <input
              onChange={this.onChange}
              name="name"
              placeholder="Account name"
              type="text"
              value={name}
              className="form-control"
            />
          </div>
          {error && <p className="alert alert-danger">{error.message}</p>}
          <button
            className="btn btn-primary"
            disabled={isInvalid}
            type="submit"
          >
            Set Name
          </button>
        </form>
      </React.Fragment>
    );
  }
}
