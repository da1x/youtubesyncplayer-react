import React, { Component } from "react";
//import "./App.css";
import "../src/css/index.css";

// Component
import Layout from "./components/Layout";
import YoutubePlayer from "./components/YoutubePlayer";
import FacebookLogin from "react-facebook-login";

class App extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: ""
  };

  responseFacebook = response => {
    console.log(response);

    this.setState({
      isLoggedIn: true,
      userID: response.userID,
      name: response.name,
      email: response.email,
      picture: response.picture.data
    });
  };

  render() {
    let fbContent;

    if (this.state.isLoggedIn) {
      fbContent = (
        <div className="container">
          <br />
          {/*<YoutubePlayer />*/}
          <Layout />
        </div>
      );
    } else {
      fbContent = (
        <div>
          <h3>Please Login To Use Youtube Sync Player</h3>
          <FacebookLogin
            appId="494156617659413"
            autoLoad={false}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
          />
        </div>
      );
    }
    return <div className="container">{fbContent}</div>;
  }
}
export default App;
