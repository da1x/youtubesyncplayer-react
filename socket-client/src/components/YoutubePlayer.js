import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import YouTube from "react-youtube";

const videoIdA = "IHNzOHi8sJs";
const videoIdB = "nVS7p4TqF3E";

class YoutubePlayer extends Component {
  constructor() {
    super();

    this.state = {
      endpoint: "http://localhost:4001",
      videoId: null,
      player: null,
      playState: null,
      muteButton: "Mute"
    };

    this.onReady = this.onReady.bind(this);

    console.log("Youtube Player: " + this.state.playState);
  }

  //Socket IO
  // sending sockets
  sendPlayState = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("PlayState", this.state.playState);
  };

  sendVideoId = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("change videoId", this.state.videoId);
  };

  // adding the function
  setPlayState = playState => {
    this.setState({ playState }, () => {
      this.sendPlayState();
    });
    console.log("Play State: " + playState);
  };

  setVideoID = () => {
    let idToSet = this.state.videoId ? videoIdA : videoIdB;
    console.log(idToSet);
    this.setState({ idToSet }, () => {
      this.sendVideoId();
    });
    console.log("Set Video Id: " + this.state.videoId);
  };

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    socket.on("PlayState", playState => {
      switch (playState) {
        case "Play":
          this.onPlayVideo();
          break;
        case "Pause":
          this.onPauseVideo();
          break;
        case "Mute":
          this.MuteVideo();
          break;
        case "ChangeVideo":
          this.onChangeVideo();
          break;
        default:
          console.log("PlayState Error. Please try again.");
          break;
      }

      socket.on("change videoId", videoId => {
        this.onChangeVideo(videoId);
        console.log("Video Id has been changed to: " + this.state.videoId);
      });
    });

    socket.on("Play", () => {
      this.onPlayVideo();
    });
  }

  //Youtube function
  onReady(event) {
    console.log(
      `YouTube Player object for videoId: "${
        this.state.videoId
      }" has been saved to state.`
    ); // eslint-disable-line
    this.setState({
      player: event.target,
      videoId: videoIdA
    });
  }

  onPlayVideo() {
    this.state.player.playVideo();
    console.log(this.state.player.getCurrentTime());
  }

  onPauseVideo() {
    this.state.player.pauseVideo();
  }

  MuteVideo() {
    if (this.state.player.isMuted()) {
      this.state.player.unMute();
      this.setState({ muteButton: "Mute" });
    } else {
      this.state.player.mute();
      this.setState({ muteButton: "Unmute" });
    }
  }

  onChangeVideo() {
    if (this.state.videoId === videoIdA) {
      this.setState.videoId = videoIdB;
      console.log(this.setState.videoId + " :: " + videoIdB);
    } else if (this.state.videoId === videoIdB) {
      this.setState.videoId = videoIdA;
      console.log(this.setState.videoId + " :: " + videoIdA);
    }
  }

  render() {
    return (
      <div>
        <YouTube videoId={this.state.videoId} onReady={this.onReady} />
        <br />
        <button onClick={() => this.setPlayState("Play")}>Play</button>
        <button onClick={() => this.setPlayState("Pause")}>Pause</button>
        <button onClick={() => this.setPlayState("ChangeVideo")}>
          Change Video
        </button>
        <button onClick={() => this.setPlayState("Mute")}>
          {this.state.muteButton}
        </button>
      </div>
    );
  }
}

export default YoutubePlayer;
