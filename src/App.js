import React, { Component } from "react";
import YoutubePlayer from "./YoutubePlayer";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        Youtube
        <YoutubePlayer videoId="IHNzOHi8sJs" />
      </div>
    );
  }
}

export default App;
