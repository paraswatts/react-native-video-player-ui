import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  NetInfo,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ViewPropTypes
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
var { height, width } = Dimensions.get("window");
// import { print } from "../../utils/commonfun";
import AnimatedHideView from "react-native-animated-hide-view";
import Orientation from "react-native-orientation-locker";

let ViewPropTypesVar;

if (ViewPropTypes) {
  ViewPropTypesVar = ViewPropTypes;
} else {
  ViewPropTypesVar = View.propTypes;
}
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.togglePlay = this.togglePlay.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }
  get initialState() {
    return {
      playing: true,
      muted: false,
      shuffle: false,
      sliding: false,
      currentTime: 0,
      songIndex: 0,
      songsArray: [],
      networkType: null,
      fullScreen: false,
      isLoading: false,
      songPercentage: 0,
      playFromBeginning: false,
      onEnd: false,
      isChildVisible: true,
      show: true,
      hideFull: true,
      statusBarHeight: 0,
      spinValue: new Animated.Value(0),
      spinValue: new Animated.Value(0),
      rotate: false,
      spin: null,
      clearId: ""
    };
  }

  componentWillMount() {
    Orientation.lockToPortrait();
    // Orientation.addOrientationListener(this._orientationDidChange);

    if (Platform.OS === "")
      this.setState({
        statusBarHeight:
          Platform.OS === "android" ? StatusBar.currentHeight : 20
      });
  }

  _orientationDidChange = orientation => {
    if (orientation === "LANDSCAPE") {
      this.toggleFullScreen();
    } else {
      this.toggleFullScreen();

      // do something with portrait layout
    }
  };
  componentWillReceiveProps(nextProps) {}

  closeModel() {
    this.setState(this.initialState);

    Orientation.lockToPortrait();
    this.props.backTo_Topics();
  }
  togglePlay() {
    if (this.state.playFromBeginning) {
      this.refs.audio.seek(0);
      this.setState({
        playFromBeginning: false,
        onEnd: false
      });
    }
    this.setState({ playing: !this.state.playing, isLoading: false });
  }

  toggleVolume() {
    this.setState({ muted: !this.state.muted });
  }

  randomSongIndex() {
    const { params } = this.props.navigation.state;
    let maxIndex = params.songs.length - 1;
    return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0;
  }

  setTime(params) {
    this.setState({ isLoading: false });
    if (!this.state.onEnd) {
      if (!this.state.sliding) {
        this.setState({ currentTime: params.currentTime });
      }
      if (this.state.songDuration !== undefined) {
        this.setState({
          songPercentage: this.state.currentTime / this.state.songDuration
        });
      } else {
        this.setState({ songPercentage: 0 });
      }
    }
  }

  onLoad(params) {
    this.setState({ isLoading: false, songDuration: params.duration });
  }

  onLoadStart() {
    this.setState({ isLoading: true });
  }

  onSlidingStart() {
    this.setState({
      isLoading: true,
      sliding: true,
      currentTime: this.state.currentTime
    });
  }

  onSlidingChange(value) {
    let newPosition = value * this.state.songDuration;
    console.log("newPosition", newPosition);
    this.refs.audio.seek(newPosition);
    this.setState({ currentTime: newPosition });
  }

  onSlidingComplete() {
    this.refs.audio.seek(this.state.currentTime);
    this.setState({ sliding: false });
  }

  toggleFullScreen() {
    this.setState(
      { fullScreen: !this.state.fullScreen, rotate: !this.state.rotate },
      () => {
        if (this.state.fullScreen) {
          var clearId = setTimeout(() => {
            this.setState({ isChildVisible: false });
          }, 5000);
          this.setState({ clearId: clearId }, () => {});

          Animated.timing(this.state.spinValue, {
            toValue: 1,
            duration: 250,
            easing: Easing.linear
          }).start();
        } else {
          clearTimeout(this.state.clearId);
          this.setState({ isChildVisible: true });
          setTimeout(() => {
            this.setState({ isChildVisible: true });
          }, 5000);

          Animated.timing(this.state.spinValue, {
            toValue: 0,
            duration: 250,
            easing: Easing.linear
          }).start();
        }
      }
    );
  }
  onEnd() {
    this.setState({
      playing: false,
      currentTime: 0,
      playFromBeginning: true,
      songPercentage: 0,
      onEnd: true
    });
  }

  toggleForward() {
    this.setState(
      {
        currentTime:
          this.state.currentTime + 10 <= this.state.songDuration
            ? this.state.currentTime + 10
            : this.state.currentTime +
              (this.state.songDuration - this.state.currentTime)
      },
      () => {}
    );
  }

  toggleBackward() {
    this.setState({
      currentTime:
        this.state.currentTime - 10 >= 0
          ? this.state.currentTime - 10
          : this.state.currentTime - this.state.currentTime
    });
  }
  renderButton() {
    let playButton;
    if (this.state.playing) {
      playButton = <Icon name="pause" size={30} color="#999" />;
    } else {
      playButton = <Icon name="play-arrow" size={30} color="#999" />;
    }

    let volumeButton;
    if (this.state.muted) {
      volumeButton = <Icon name="volume-off" size={30} color="#999" />;
    } else {
      volumeButton = <Icon name="volume-up" size={30} color="#999" />;
    }

    let forwardButton = (
      <Icon
        onPress={() => {
          this.toggleForward();
        }}
        style={{ marginTop: 20 }}
        name="forward-10"
        size={30}
        color="#999"
      />
    );

    let backwardButton = (
      <Icon
        onPress={() => {
          this.toggleBackward();
        }}
        style={{ marginTop: 20 }}
        name="replay-10"
        size={30}
        color="#999"
      />
    );

    let fullscreenButton = <Icon name="fullscreen" size={30} color="#999" />;

    let fullscreenExitButton = (
      <Icon name="fullscreen-exit" size={30} color="#999" />
    );

    let backButton = (
      <Icon
        onPress={() => this.toggleBack()}
        style={{ left: 15 }}
        name="chevron-left"
        size={35}
        color="#999"
      />
    );

    return (
      <View style={styles.controls}>
        <View>
          <Animated.View style={[styles.sliderContainer]}>
            <View>
              {this.state.songDuration && (
                <Slider
                  onSlidingStart={this.onSlidingStart.bind(this)}
                  onSlidingComplete={this.onSlidingComplete.bind(this)}
                  onValueChange={this.onSlidingChange.bind(this)}
                  minimumTrackTintColor="#851c44"
                  style={styles.slider}
                  // trackStyle={styles.sliderTrack}
                  // thumbStyle={styles.sliderThumb}
                  value={this.state.songPercentage}
                />
              )}
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.VideotimeTxt}>
                {formattedTime(this.state.currentTime)}
              </Text>
              <Text style={styles.VideotimeTxt}>
                -{" "}
                {formattedTime(
                  this.state.songDuration - this.state.currentTime
                )}
              </Text>
            </View>
          </Animated.View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#222",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Animated.View style={[styles.vCntrlBtn]}>
              <TouchableOpacity onPress={this.toggleVolume}>
                <Text>{volumeButton}</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* <TouchableOpacity style={[styles.vCntrlBtn]}>
              <Text>{backwardButton}</Text>
            </TouchableOpacity> */}
            <Animated.View style={[styles.vCntrlBtn]}>
              <TouchableOpacity onPress={this.togglePlay}>
                <Text>{playButton}</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* <TouchableOpacity style={[styles.vCntrlBtn]}>
              <Text>{forwardButton}</Text>
            </TouchableOpacity> */}
            {this.props.disableFullscreen ? null : (
              <Animated.View style={[styles.vCntrlBtn]}>
                <TouchableOpacity onPress={this.toggleFullScreen}>
                  <Text>{fullscreenButton}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    );
  }

  renderButtonFull() {
    let playButton;

    if (this.state.playing) {
      playButton = (
        <Icon style={styles.playFull} name="pause" size={30} color="#999" />
      );
    } else {
      playButton = (
        <Icon
          style={styles.playFull}
          name="play-arrow"
          size={30}
          color="#999"
        />
      );
    }

    let volumeButton;
    if (this.state.muted) {
      volumeButton = (
        <Icon
          style={styles.volumeFull}
          name="volume-off"
          size={30}
          color="#999"
        />
      );
    } else {
      volumeButton = (
        <Icon
          style={styles.volumeFull}
          name="volume-up"
          size={30}
          color="#999"
        />
      );
    }

    let fullscreenButton = (
      <Icon
        style={{ marginTop: 20 }}
        name="fullscreen"
        size={30}
        color="#999"
      />
    );

    let forwardButton = (
      <Icon
        style={{ marginTop: 20 }}
        name="forward-10"
        size={30}
        color="#999"
      />
    );

    let backwardButton = (
      <Icon style={{ marginTop: 20 }} name="replay-10" size={30} color="#999" />
    );

    let fullscreenExitButton = (
      <Icon name="fullscreen-exit" size={30} color="#999" />
    );

    let backButton = (
      <Icon style={{}} name="expand-less" size={35} color="#999" />
    );

    return (
      <AnimatedHideView
        duration={200}
        visible={this.state.isChildVisible}
        style={[styles.controlsFull]}
      >
        <View
          style={{
            width: 60,
            // borderColor: "green",
            // borderWidth: 1,
            alignSelf: "flex-start",
            justifyContent: "space-around",
            alignItems: "center",
            height: "100%",
            position: "relative",
            zIndex: 99
          }}
        >
          <Animated.View style={[styles.vCntrlBtn, styles.vCntrlBtnFull]}>
            <TouchableOpacity onPress={this.toggleVolume}>
              <Text>{volumeButton}</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* <TouchableOpacity style={[styles.vCntrlBtn, styles.vCntrlBtnFull]}>
            <Text>{backwardButton}</Text>
          </TouchableOpacity> */}
          <Animated.View style={[styles.vCntrlBtn, styles.vCntrlBtnFull]}>
            <TouchableOpacity onPress={this.togglePlay}>
              <Text>{playButton}</Text>
            </TouchableOpacity>
          </Animated.View>
          {/* <TouchableOpacity style={[styles.vCntrlBtn, styles.vCntrlBtnFull]}>
            <Text>{forwardButton}</Text>
          </TouchableOpacity> */}
          <Animated.View style={[styles.vCntrlBtn, styles.vCntrlBtnFull]}>
            <TouchableOpacity onPress={this.toggleFullScreen}>
              <Text>{fullscreenExitButton}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Animated.View style={[styles.sliderContainerFull]}>
          <View style={[styles.sliderContainerFullInner]}>
            {this.state.songDuration && (
              <Slider
                orientation={"vertical"}
                onSlidingStart={this.onSlidingStart.bind(this)}
                onSlidingComplete={this.onSlidingComplete.bind(this)}
                onValueChange={this.onSlidingChange.bind(this)}
                minimumTrackTintColor="#851c44"
                style={[styles.sliderFull]}
                trackStyle={styles.sliderTrack}
                thumbStyle={styles.sliderThumb}
                value={this.state.songPercentage}
              />
            )}
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.VideotimeTxt}>
              {formattedTime(this.state.currentTime)}
            </Text>
            <Text style={styles.VideotimeTxt}>
              -{" "}
              {formattedTime(this.state.songDuration - this.state.currentTime)}
            </Text>
          </View>
        </Animated.View>
      </AnimatedHideView>
    );
  }

  render() {
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["-90deg", "0deg"]
    });
    const spin1 = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "90deg"]
    });
    let songPercentage;
    if (this.state.songDuration !== undefined) {
      songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
      songPercentage = 0;
    }
    let { uri, muted, paused, disableFullscreen, autoplay } = this.props;

    return (
      <View style={styles.mainContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState(
              { isChildVisible: !this.state.isChildVisible },
              () => {
                if (this.state.isChildVisible) {
                  setTimeout(() => {
                    this.setState({ isChildVisible: false });
                  }, 5000);
                }
              }
            );
          }}
        >
          <Animated.View
            style={[
              styles.container,
              { transform: [{ rotate: this.state.fullScreen ? spin : spin1 }] }
            ]}
          >
            <View style={styles.containerInner}>
              <View
                style={
                  !this.state.fullScreen ? styles.view : styles.topViewStyle
                }
              >
                <Video
                  source={{
                    uri: uri
                  }}
                  ref="audio"
                  style={[
                    !this.state.fullScreen
                      ? styles.video
                      : {
                          height: width,
                          width: height + this.state.statusBarHeight
                        }
                  ]}
                  onBuffer={obj => {
                    this.setState({ isLoading: true });
                  }} // Callback when remote video is buffering
                  volume={muted ? 0 : 1.0}
                  muted={muted}
                  paused={paused}
                  onLoadStart={this.onLoadStart.bind(this)}
                  onLoad={this.onLoad.bind(this)}
                  onProgress={this.setTime.bind(this)}
                  onEnd={this.onEnd.bind(this)}
                  resizeMode="contain"
                  onError={error => {
                    console.log(error);
                  }}
                  repeat={false}
                />
                <ActivityIndicator
                  animating={this.state.isLoading}
                  size="large"
                  color="#999"
                  style={{ position: "absolute" }}
                />
              </View>
              {!this.state.fullScreen ? this.renderButton() : null}
            </View>
            {this.state.fullScreen ? this.renderButtonFull() : null}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

VideoPlayer.propTypes = {
  uri: Video.propTypes.source,
  autoplay: PropTypes.bool,
  paused: PropTypes.bool,
  muted: PropTypes.bool,
  disableFullscreen: PropTypes.bool,
  loop: PropTypes.bool,
  disableSeek: PropTypes.bool,
  fullScreenOnLongPress: PropTypes.bool,
  theme: PropTypes.string,
  customStyles: PropTypes.shape({
    seekBar: ViewPropTypesVar.style,
    seekBarFullWidth: ViewPropTypesVar.style,
    seekBarProgress: ViewPropTypesVar.style,
    seekBarKnob: ViewPropTypesVar.style,
    seekBarKnobSeeking: ViewPropTypesVar.style,
    seekBarBackground: ViewPropTypesVar.style
  }),
  onEnd: PropTypes.func,
  onProgress: PropTypes.func,
  onLoad: PropTypes.func,
  onStart: PropTypes.func,
  onPlayPress: PropTypes.func
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  vCntrlBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 4
  },
  vCntrlBtnFull: {
    transform: [
      {
        rotateZ: "90deg"
      }
    ]
  },
  view: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  video: {
    height: width / (16 / 9),
    width: width - 30
  },
  container: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  topViewStyle: {
    transform: [{ rotateZ: "90deg" }],
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: width,
    width: height
  },
  videoStyle: {
    height: width,
    width: height
  },
  header: {
    marginTop: 17,
    marginBottom: 17,
    width: window.width
  },
  headerClose: {
    position: "absolute",
    top: 10,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center"
  },
  songImage: {
    marginBottom: 20
  },
  songTitle: {
    marginRight: 20,
    marginLeft: 20,
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 10,
    marginTop: 13,
    fontSize: 19
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 20
  },
  play: {},
  playFull: {
    transform: [{ rotateZ: "90deg" }]
  },

  playRotate: {
    transform: [{ rotateZ: "90deg" }]
  },

  controls: {
    width: width,
    alignSelf: "flex-start",
    bottom: 0,
    zIndex: 99
  },

  controlsFull: {
    top: 0,
    bottom: 0,
    alignSelf: "flex-start",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    position: "absolute",
    width: 120
  },

  controlsFullscreen: {
    position: "absolute",
    flexDirection: "row"
  },
  back: {
    marginTop: 22,
    marginLeft: 45
  },
  play: {
    marginLeft: 50,
    marginRight: 50
  },
  forward: {
    marginTop: 22,
    marginRight: 45
  },
  shuffle: {
    marginTop: 26
  },
  volume: {},

  volumeFull: {
    transform: [{ rotateZ: "90deg" }]
  },
  volumeRotate: {
    marginTop: 26,
    transform: [{ rotateZ: "90deg" }]
  },
  sliderContainer: {
    padding: 5,
    backgroundColor: "#222",
    paddingTop: 5
  },
  sliderContainerFull: {
    position: "absolute",
    paddingHorizontal: 90,
    width: height,
    transform: [
      {
        rotateZ: "90deg"
      },
      {
        translateY: -20
      },
      {
        translateX: 0
      }
    ],
    paddingVertical: 10
  },
  sliderContainerFullInner: {},
  timeInfo: {
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  VideotimeTxt: {
    fontSize: 12,
    color: "#aaa"
  },
  time: {
    color: "#FFF",
    flex: 1,
    fontSize: 10
  },
  timeRight: {
    color: "#FFF",
    textAlign: "right",
    flex: 1,
    fontSize: 10
  },
  sliderFull: {
    transform: [
      {
        rotateZ: "0deg"
      }
    ]
  },
  sliderTrack: {
    height: 3,
    backgroundColor: "#444"
  },
  sliderThumb: {
    marginBottom: 50,
    width: 14,
    height: 14,
    backgroundColor: "#aaa",
    borderRadius: 7
  },
  close: {
    top: 5,
    left: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: 50,
    borderRadius: 30
  }
});

function withLeadingZero(amount) {
  if (amount < 10) {
    return `0${amount}`;
  } else {
    return `${amount}`;
  }
}

function formattedTime(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if (isNaN(minutes) || isNaN(seconds)) {
    return "";
  } else {
    return `${withLeadingZero(minutes)}:${withLeadingZero(seconds.toFixed(0))}`;
  }
}

function formatTime(second) {
  let h = 0,
    i = 0,
    s = parseInt(second);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
  }
  // 补零
  let zero = function(v) {
    return v >> 0 < 10 ? "0" + v : v;
  };
  return [zero(h), zero(i), zero(s)].join(":");
}
