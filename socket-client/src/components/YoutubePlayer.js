import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import YouTube from "react-youtube";

const videoIdA = "IHNzOHi8sJs";
const videoIdB = "nVS7p4TqF3E";

class YoutubePlayer extends Component {
  constructor() {
    super();

    this.state = {
      endpoint: "http://127.0.0.1:4001",

      videoId: null,
      player: null,
      playState: null
    };

    this.onReady = this.onReady.bind(this);
    //this.onChangeVideo = this.onChangeVideo.bind(this);
    //this.onPlayVideo = this.onPlayVideo.bind(this);
    //this.onPauseVideo = this.onPauseVideo.bind(this);
    //this.MuteVideo = this.MuteVideo.bind(this);

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

  setVideoID = videoID => {
    this.setState({ videoID }, () => {
      this.sendVideoId();
    });
    console.log("Set Video Id: " + videoID);
  };

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    socket.on("PlayState", playState => {
      console.log("YoutubePlayer.js componentDidMount: " + playState);

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
    } else {
      this.state.player.mute();
    }
  }

  onChangeVideo(videoId) {
    if (videoId === videoIdA) {
      this.setState.videoID = videoIdB;
    } else if (videoId === videoIdB) {
      this.setState.videoID = videoIdA;
    }
  }

  render() {
    return (
      <div>
        <YouTube videoId={this.state.videoId} onReady={this.onReady} />
        <br />
        <button onClick={() => this.setPlayState("Play")}>Play</button>
        <button onClick={() => this.setPlayState("Pause")}>Pause</button>
        <button onClick={() => this.setVideoID(this.state.videoId)}>
          Change Video
        </button>
        <button onClick={() => this.setPlayState("Mute")}>Mute</button>
      </div>
    );
  }
}

export default YoutubePlayer;
