import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './AudioPlayer.css';
import { awsSigning } from '../utils.js';

class AudioPlayer extends PureComponent {
  static propTypes = {
    songs: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    onTimeUpdate: PropTypes.func,
    onEnded: PropTypes.func,
    onError: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
  };

  static defaultProps = {
    onTimeUpdate: () => { },
    onEnded: () => { },
    onError: () => { },
    onPlay: () => { },
    onPause: () => { }
  };

  constructor(props) {
    super(props);

    this.state = {
      active: props.songs[0],
      songs: props.songs,
      current: 0,
      progress: 0,
      random: false,
      playing: !!props.autoplay,
      mute: false,
      valueSet: false
    };

    this.audio = document.createElement('audio');
    this.audio.src = this.state.active.url;
    this.audio.autoplay = !!this.state.autoplay;

    this.audio.addEventListener('timeupdate', e => {
      this.updateProgress();
      props.onTimeUpdate(e);
    });

    this.audio.addEventListener('ended', e => {
      props.onEnded(e);
    });

    this.audio.addEventListener('error', e => {
      props.onError(e);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.songs[0],
      songs: nextProps.songs,
      current: 0,
      progress: 0,
      random: false,
      playing: !!nextProps.autoplay,
      mute: false,
    });
  }

  shuffle = arr => arr.sort(() => Math.random() - 0.5);

  updateProgress = () => {
    const { duration, currentTime } = this.audio;
    const progress = (currentTime * 100) / duration;

    this.setState({ progress: progress });
  };

  setProgress = e => {
    const target = e.target.nodeName === 'SPAN' ? e.target.parentNode : e.target;
    const width = target.clientWidth;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const duration = this.audio.duration;
    const currentTime = (duration * offsetX) / width;
    const progress = (currentTime * 100) / duration;

    this.audio.currentTime = currentTime;

    this.setState({
      progress: progress,
    });

    this.play();
  };

  play = () => {
    this.setState({ playing: true });
    this.audio.play();
    this.props.onPlay();
  };

  pause = () => {
    this.setState({
      playing: false,
    });

    this.audio.pause();
    this.props.onPause();
  };

  toggle = () => {
    if (!this.state.playing && Object.keys(this.props.componentDetail).length !== 0 && !this.state.valueSet) {
      this.sendRequest();
      this.setState({ valueSet: true });
    }
    this.state.playing ? this.pause() : this.play();
  }

  sendRequest = async () => {
    let dynamoRequest = {
      'action': "SongDistribution",
      'sID': this.props.componentDetail.sID,
      'uID': this.props.componentDetail.uID
    }
    // Send request to AWS
    awsSigning(dynamoRequest, 'v1/dynamoaction');
  }

  randomize = () => {
    const { random, songs } = this.state;
    const shuffled = this.shuffle(songs.slice());

    this.setState({
      songs: !random ? shuffled : songs,
      random: !random,
    });
  };

  toggleMute = () => {
    const { mute } = this.state;

    this.setState({
      mute: !mute,
    });

    this.audio.volume = !!mute;
  };

  render() {
    const {
      active: currentSong,
      progress,
      playing,
      mute,
    } = this.state;

    const playPauseClass = classnames({
      'fa': true,
      'fa-play': !playing,
      'fa-pause': playing,
    });

    const volumeClass = classnames({
      'fa': true,
      'fa-volume-up': !mute,
      'fa-volume-off': mute,
    });

    return (
      <div className="player-container">
        <div className="artist-info">
          <h2 className="artist-song-name">{currentSong.artist.song}</h2>
          <h3>Artist: <span className="artist-name">{currentSong.artist.name}</span></h3>
        </div>

        {!this.props.quotaOver &&
          <div>
            <div className="player-progress-container" onClick={e => this.setProgress(e)}>
              <span className="player-progress-value" style={{ width: progress + '%' }}></span>
            </div>

            <div className="player-options">
              <div className="player-buttons player-controls">
                <button onClick={this.toggle} className="player-btn medium" title="Play/Pause">
                  <i className={playPauseClass}></i>
                </button>
              </div>

              <div className="player-buttons">
                <button className="player-btn small volume" onClick={this.toggleMute} title="Mute/Unmute">
                  <i className={volumeClass}></i>
                </button>
              </div>
            </div>
          </div>
        }

        {this.props.quotaOver &&
          <div>
            <p style={{ color: "#cc0000" }}>Quota Over</p>
            You gotta purchase to keep the magic goin!
            <br /><br />
          </div>
        }

      </div>
    );
  }
}

export default AudioPlayer;
