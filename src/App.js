import React, { Component } from "reactn";
import RootState from "../src/GlobalState/RootState.js";
import "./App.css"; //this will be global styles
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes/Routes.js";
import Layout from "./Components/Layout/Layout.js";
import Listener from "./Components/Utilities/Listener.js";
RootState();

class App extends Component {
  render() {
    const isLoggedIn =
      this.global.account.isLoggedIn && this.global.account.isEmailVerified;
    return (
      <div className="App">
        <Listener />
        <Router>
          <Layout>
            <Routes isLoggedIn={isLoggedIn} />
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
