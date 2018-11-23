import React, { Component } from "react";
import YouTube from "react-youtube";

const videoIdA = "IHNzOHi8sJs";
const videoIdB = "nVS7p4TqF3E";

class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: videoIdA,
      player: null
    };

    this.onReady = this.onReady.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.MuteVideo = this.MuteVideo.bind(this);
  }

  onReady(event) {
    console.log(
      `YouTube Player object for videoId: "${
        this.state.videoId
      }" has been saved to state.`
    ); // eslint-disable-line
    this.setState({
      player: event.target
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
    this.state.player.mute();
  }

  onChangeVideo() {
    this.setState({
      videoId: this.state.videoId === videoIdA ? videoIdB : videoIdA
    });
  }

  render() {
    return (
      <div>
        <YouTube videoId={this.state.videoId} onReady={this.onReady} />
        <br />
        <button onClick={this.onPlayVideo}>Play</button>
        <button onClick={this.onPauseVideo}>Pause</button>
        <button onClick={this.onChangeVideo}>Change Video</button>
        <button onClick={this.MuteVideo}>Mute</button>
      </div>
    );
  }
}

export default YoutubePlayer;
