import React, { Component } from "react";
import { PLAY_STATE, VIDEO_ID, MUTE_STATE } from "../../Events";
import YouTube from "react-youtube";

// Hard coded 2 different youtube video id
const videoIdA = "IHNzOHi8sJs";
const videoIdB = "nVS7p4TqF3E";

export default class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: [videoIdA, videoIdB],
      videoIdIndex: 1,
      player: null,
      isMuted: false,
      isPlaying: false
    };
  }
  // Init Youtube player
  onReady = event => {
    console.log("Youtube player ready.");
    this.setState({ player: event.target });
  };

  // Life cycle component - listens to server boardcast
  componentDidMount() {
    const { socket } = this.props;
    socket.on(PLAY_STATE, isPlaying => {
      this.setState({ isPlaying: !isPlaying });
      console.log("Youtube Component - isPlaying: " + isPlaying);
      this.playingStateFunction(isPlaying);
    });

    socket.on(VIDEO_ID, videoIdIndex => {
      this.changeVideoFunction(videoIdIndex);
    });

    socket.on(MUTE_STATE, isMuted => {
      this.setState({ isMuted: !isMuted });
      console.log("Youtube Component - isMuted: " + isMuted);
      this.muteFunction(isMuted);
    });
  }
  //--------------------

  // Play/Pause Function
  handlePlayButton = prevState => {
    const { isPlaying } = this.state;
    const { socket } = this.props;

    // Send play state to server
    socket.emit(PLAY_STATE, isPlaying);
  };

  playingStateFunction = isPlaying => {
    const { player } = this.state;
    isPlaying === false ? player.playVideo() : player.pauseVideo();
  };
  //--------------------

  // Change Video
  handleChangeVideoButton = () => {
    const { videoIdIndex } = this.state;
    const { socket } = this.props;

    if (videoIdIndex !== 1) {
      this.setState({ videoIdIndex: 1 });
      console.log("1");
    } else {
      this.setState({ videoIdIndex: 0 });
      console.log("0");
    }

    // Send Video index to server
    socket.emit(VIDEO_ID, videoIdIndex);
  };

  changeVideoFunction = videoIdIndex => {
    const { player, videoId } = this.state;

    player.loadVideoById(videoId[videoIdIndex]);
  };

  // Mute function - Handles button name, socket emit and mute/unmute player
  handleMuteButton = prevState => {
    const { isMuted } = this.state;
    const { socket } = this.props;

    // Send mute state to server
    socket.emit(MUTE_STATE, isMuted);
  };

  muteFunction = isMuted => {
    const { player } = this.state;
    isMuted === true ? player.unMute() : player.mute();
  };
  //--------------------

  render() {
    const { videoId, isMuted, isPlaying, videoIdIndex } = this.state;
    //For autoplay add autoplay: 1 to opts
    const opts = { playerVars: { showinfo: 0, controls: 0, autohide: 1 } };
    return (
      <div>
        <div className="youtube">
          <YouTube videoId={videoId[0]} opts={opts} onReady={this.onReady} />
        </div>
        <br />
        <div className="youtube-container-button">
          <button
            className="buttonName"
            onClick={() => this.handlePlayButton()}
          >
            {isPlaying === false ? "Play" : "Pause"}
          </button>
          <button
            className="buttonName"
            onClick={() => this.handleChangeVideoButton()}
          >
            Change Video
          </button>
          <button
            className="buttonName"
            onClick={() => this.handleMuteButton()}
          >
            {isMuted === false ? "Mute" : "Unmute"}
          </button>
        </div>
      </div>
    );
  }
}
