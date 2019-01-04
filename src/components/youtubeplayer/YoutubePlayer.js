import React, { Component } from "react";
import { PLAY_STATE, VIDEO_ID, MUTE_STATE } from "../../Events";
import YouTube from "react-youtube";

const videoIdA = "IHNzOHi8sJs";
const videoIdB = "nVS7p4TqF3E";

export default class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: videoIdA,
      player: null,
      playState: null,
      muteButton: "Mute"
    };
  }

  //Socket IO
  // sending sockets

  componentDidMount() {
    const { socket } = this.props;
    const { player } = this.state;
    socket.on(PLAY_STATE, videoState => {
      this.ChangePlayState(videoState);
    });

    socket.on(MUTE_STATE, muteState => {
      this.ChangeMuteState(muteState);
    });

    socket.on(VIDEO_ID, videoIdFromServer => {
      this.setState({
        videoId: videoIdFromServer
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { playState } = this.state;
    const { socket } = this.props;

    //Check if play state changed
    if (playState !== prevState.playState) {
      socket.emit(PLAY_STATE, playState);
      console.log(playState);
    }
  }

  //Youtube function
  onReady = event => {
    console.log(
      `YouTube Player object for videoId: "${
        this.state.videoId
      }" has been saved to state.`
    ); // eslint-disable-line
    this.setState({
      player: event.target
    });
  };

  handlePlayState = videoState => {
    this.setState({ playState: videoState });
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
      default:
        console.log("PlayState Error. Please try again.");
        break;
    }
  };

  ChangeMuteState = muteState => {
    const { player } = this.state;
    if (muteState === "Mute") {
      player.unMute();
    } else if (muteState === "Unmute") {
      player.mute();
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
    const { socket } = this.props;
    const { player, muteButton } = this.state;
    if (player.isMuted()) {
      player.unMute();
      this.setState({ muteButton: "Unmute" }, () => {
        socket.emit(MUTE_STATE, muteButton);
      });
    } else {
      player.mute();
      this.setState({ muteButton: "Mute" }, () => {
        socket.emit(MUTE_STATE, muteButton);
      });
    }
  };

  onChangeVideo = () => {
    const { videoId } = this.state;
    const { socket } = this.props;
    if (videoId === videoIdA) {
      this.setState({ videoId: videoIdB }, () => {
        socket.emit(VIDEO_ID, videoIdB);
      });
    } else if (videoId === videoIdB) {
      this.setState({ videoId: videoIdA }, () => {
        socket.emit(VIDEO_ID, videoIdA);
      });
    }
  };

  render() {
    const { videoId, muteButton } = this.state;
    const opts = { playerVars: { showinfo: 0, controls: 0, autohide: 1 } };
    //autoplay: 1
    return (
      <div>
        <div className="youtube">
          <YouTube videoId={videoId} opts={opts} onReady={this.onReady} />
        </div>
        <br />
        <div className="youtube-container-button">
          <button
            className="buttonName"
            onClick={() => this.handlePlayState("Play")}
          >
            Play
          </button>
          <button
            className="buttonName"
            onClick={() => this.handlePlayState("Pause")}
          >
            Pause
          </button>
          <button
            className="buttonName"
            onClick={() => this.handlePlayState("ChangeVideo")}
          >
            Change Video
          </button>
          <button
            className="buttonName"
            onClick={() => this.ChangePlayState("Mute")}
          >
            {muteButton}
          </button>
        </div>
      </div>
    );
  }
}
