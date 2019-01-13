import React, { Component } from "react";
import { PLAY_STATE, VIDEO_ID, MUTE_STATE } from "../../Events";
import YouTube from "react-youtube";

const videoIdA = "IHNzOHi8sJs";
const videoIdB = "nVS7p4TqF3E";

export default class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: [videoIdA, videoIdB],
      videoIdIndex: 0,
      player: null,
      isMuted: false,
      isPlaying: false
    };
  }
  // Init Youtube player
  onReady = event => {
    console.log(
      `YouTube Player object for videoId: "${
        this.state.videoId[0]
      }" has been saved to state.`
    ); // eslint-disable-line
    this.setState({ player: event.target });
  };

  // Life cycle component
  componentDidMount() {
    const { socket } = this.props;
    const { videoId } = this.state;
    socket.on(PLAY_STATE, isPlaying => {
      this.setState({ isPlaying: !isPlaying });
      console.log("Youtube Component - isPlaying: " + isPlaying);
      this.playingStateFunction(isPlaying);
    });

    socket.on(VIDEO_ID, videoIdIndex => {
      //this.setState({ videoId: videoId[videoIdIndex] });
      console.log("Youtube Component - videoId: " + videoIdIndex);
      this.changeVideoFunction(videoIdIndex);
    });

    socket.on(MUTE_STATE, isMuted => {
      this.setState({ isMuted: !isMuted });
      console.log("Youtube Component - isMuted: " + isMuted);
      this.muteFunction(isMuted);
    });
  }

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
  handleChangeVideoButton = prevState => {
    const { videoId, videoIdIndex } = this.state;
    const { socket } = this.props;
    // TODO: Find out the index at state and pass it to socket emit
    if (videoIdIndex !== 1) {
      this.setState({ videoIdIndex: 1 });
    } else {
      this.setState({ videoIdIndex: 0 });
    }

    // Send Video index to server
    socket.emit(VIDEO_ID, videoIdIndex);
  };

  changeVideoFunction = videoIdIndex => {
    const { player, videoId } = this.state;
    // TODO: change the video index
    console.log(videoIdIndex);
    player.loadVideoById(videoId[videoIdIndex]);
    console.log("changeVideoFunction: " + videoId[videoIdIndex]);
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
    const opts = { playerVars: { showinfo: 0, controls: 0, autohide: 1 } };
    //autoplay: 1
    return (
      <div>
        <div className="youtube">
          <YouTube
            videoId={videoId[videoIdIndex]}
            opts={opts}
            onReady={this.onReady}
          />
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
