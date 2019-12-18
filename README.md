# React Native Video Player UI

A React Native video player with a few controls. This player uses
react-native-video for the video playback.


## Installation

```
npm install --save react-native-video-player-ui  
react-native-video react-native-vector-icons   
@react-native-community/slider   
react-native-animated-hide-view 
react-native-orientation-locker
Link for React-Native version<60.0
react-native link react-native-video
react-native link react-native-vector-icons
react-native link @react-native-community/slider
react-native link react-native-orientation-locker
```

## Props

| Prop                    | Description                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------|
| videoLink                   | The video source to pass to react-native-video.                                         |
| muted            | Start the video muted, can change by clicking volume button.|
| controlTimer         | Timeout when to hide the controls. (default is 5)                                                         |                                                          |
| disableFullscreen       | Disable the fullscreen button.                                                              |
| showForward                 | Show Forward Button.                                              |
| showBackward             | Show Backward Button.                                               |
| forwardTime          | Change forward time(default is 10).                                              |
| backwardTime          | Change backward time(default is 10).                                             |
            

Basic Usage

```
import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import VideoPlayer from 'react-native-video-player-ui';
export default class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <VideoPlayer
          videoLink={{
            uri:
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
        />
      </View>
    );
  }
}
```


## Future Enhancements

- [x] Make player customizable.
