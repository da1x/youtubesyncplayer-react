import React, { Component } from "react";
import "./App.css";
import YoutubePlayer from "./components/YoutubePlayer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <br />
        <YoutubePlayer />
      </div>
    );
  }
}
export default App;
