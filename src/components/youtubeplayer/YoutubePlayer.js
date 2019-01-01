import React, { Component } from "react";
import { PLAY_STATE, VIDEO_ID } from "../../Events";
import YouTube from "react-youtube";

const videoIdA = "IHNzOHi8sJs";
const videoIdB = "nVS7p4TqF3E";

export default class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: null,
      player: null,
      playState: null,
      muteButton: "Mute"
    };
  }

  //Socket IO
  // sending sockets

  componentDidMount() {
    const { socket } = this.props;
    socket.on(PLAY_STATE, videoState => {
      this.ChangePlayState(videoState);
    });
  }

  //Youtube function
  onReady = event => {
    console.log(
      `YouTube Player object for videoId: "${
        this.state.videoId
      }" has been saved to state.`
    ); // eslint-disable-line
    this.setState({
      player: event.target,
      videoId: videoIdA
    });
  };

  handlePlayState = videoState => {
    const { socket } = this.props;
    const { playState } = this.state;
    this.setState({ playState: videoState }, () => {
      socket.emit(PLAY_STATE, playState);
      console.log(playState);
    });
  };

  ChangePlayState = videoState => {
    switch (videoState) {
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
  };

  onPlayVideo = () => {
    const { player } = this.state;
    player.playVideo();
    console.log(this.state.player.getCurrentTime());
  };

  onPauseVideo = () => {
    const { player } = this.state;
    player.pauseVideo();
  };

  MuteVideo = () => {
    const { player } = this.state;
    if (player.isMuted()) {
      player.unMute();
      this.setState({ muteButton: "Mute" });
    } else {
      player.mute();
      this.setState({ muteButton: "Unmute" });
    }
  };

  onChangeVideo = () => {
    const { videoId } = this.state;
    if (videoId === videoIdA) {
      this.setState.videoId = videoIdB;
    } else if (videoId === videoIdB) {
      this.setState.videoId = videoIdA;
    }
  };

  render() {
    const { videoId, muteButton } = this.state;
    return (
      <div>
        <YouTube videoId={videoId} onReady={this.onReady} />
        <br />
        <button onClick={() => this.handlePlayState("Play")}>Play</button>
        <button onClick={() => this.handlePlayState("Pause")}>Pause</button>
        <button onClick={() => this.handlePlayState("ChangeVideo")}>
          Change Video
        </button>
        <button onClick={() => this.handlePlayState("Mute")}>
          {muteButton}
        </button>
      </div>
    );
  }
}
