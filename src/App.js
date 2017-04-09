import React from "react";
import {
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Platform,
  Image
} from "react-native";

// Components
import Display from "./Display";
import SongButton from './SongButton'
// assets
import { color } from "react-native-material-design-styles";
import logo from "./y18.gif";
import styles from "./AppStyles";

// utils
import { domainUrl } from "./utils";
import moment from "moment";

// ComponentsmarginTop:
const Card = ({ children }) => <View style={styles.card}>{children}</View>;

const cursorStyle = Platform.OS === "web" ? { cursor: "pointer" } : {};

const Overlay = ({ children, visible }) =>
  visible
    ? <View
        style={{
          position: "absolute",
          marginTop: Platform.OS === "ios" ? 48 : 28,
          zIndex: 1
        }}
      >
        <Text
          style={{
            fontSize: 28,
            marginLeft: Dimensions.get("window").width * 0.9,
            backgroundColor: "rgba(52,52,52, 0.0)",
            color: "white",
            zIndex: 3
          }}
        >
          ⏏
        </Text>
        <View
          style={{
            padding: 10,
            marginTop: -17,
            width: Dimensions.get("window").width,
            height: 400,
            backgroundColor: "rgba(255,255,255,80)"
          }}
        >
          {children}
        </View>
      </View>
    : <View />;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToTop = this.scrollToTop.bind(this);
    // this.voteSong = this.voteSong.bind(this);
    // this.voteSong = props.voteSong
    // console.log(props.voteSong)
  }

  scrollToTop() {
    this.refs._scrollView.scrollTo({ x: 0, y: 0, animated: true });
  }

  render() {
    const {
      items,
      errors,
      loading,
      filter,
      overlayVisible,
      onLoadMore,
      onLoadItems,
      onOpenUrl,
      onToggleOverlay,
      voteSong,
      votedColor,
      votedSong,
      songs
    } = this.props;


    const currentSong = {
      title: "Il cielo in una stanza",
      author: "Albano",
      color: "yellow",
      id: 123
    };

    return (
      <Card>
        {Platform.OS === "android"
          ? <StatusBar backgroundColor={"#d25500"} />
          : <View />}
        <View style={styles.body}>

          <Overlay visible={overlayVisible}>
            <Text style={{ fontSize: 18 }}>
              <Text style={{ fontWeight: "bold" }}>Gioplayer</Text>
              {" "}
              is a simple Hacker News reader for the Web and a React Native app (Android / iOS).
            </Text>
            <Text style={{ fontSize: 18, marginTop: 20 }}>
              Made with ❤ by
              <Text
                onPress={() => {
                  onOpenUrl("https://grigio.org");
                }}
              >
                <Text style={[styles.aboutLink, cursorStyle]}>
                  {" "}Luigi Maselli
                </Text>
              </Text>
              , source code:
              <Text
                onPress={() => {
                  onOpenUrl("https://github.com/grigio/HAgnostic-News");
                }}
              >
                <Text style={[styles.aboutLink, cursorStyle]}>
                  {" "}github.com/grigio/HAgnostic-News
                </Text>
              </Text>
            </Text>
          </Overlay>

          <View
            style={[
              styles.column,
              styles.header,
              Platform.OS === "ios" ? { height: 75, paddingTop: 20 } : {}
            ]}
          >
            <View style={[styles.row, { height: 50 }]}>
              <View style={styles.row}>
                <Image source={logo} style={{ width: 20 }} />
                <Text style={[{ fontWeight: "bold", paddingLeft: 4 }]}>
                  Gioplayer
                </Text>
                <Text style={[{ fontSize: 12, paddingLeft: 4 }]}>
                  {" "}{Platform.OS}
                </Text>
              </View>
              <TouchableHighlight
                style={[
                  styles.button,
                  filter === "Top" ? styles.buttonOrange : null
                ]}
                underlayColor={color.paperOrange200.color}
                onPress={() => {
                  onLoadItems("Top");
                  this.scrollToTop();
                }}
              >
                <View style={styles.row}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      paddingRight: 5
                    }}
                  >
                    Top
                  </Text>
                  {filter === "Top" && loading ? <ActivityIndicator /> : null}
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={[
                  styles.button,
                  filter === "Latest" ? styles.buttonOrange : null
                ]}
                underlayColor={color.paperOrange200.color}
                onPress={() => {
                  onLoadItems("Latest");
                  this.scrollToTop();
                }}
              >
                <View style={styles.row}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      paddingRight: 5
                    }}
                  >
                    Latest
                  </Text>
                  {filter === "Latest" && loading
                    ? <ActivityIndicator />
                    : null}
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={color.paperOrange200.color}
                onPress={() => {
                  onToggleOverlay();
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", padding: 10 }}
                >
                  ?
                </Text>
              </TouchableHighlight>
            </View>
            {Object.keys(errors).length > 0
              ? <View style={[styles.row, { flex: 1, backgroundColor: "red" }]}>
                  {Object.keys(errors).map((error, i) => (
                    <Text key={i}>. {errors[error].message}</Text>
                  ))}
                </View>
              : null}

          </View>

          <View style={styles.scrollViewContainer}>
            {/* Display */}
            <Display currentSong={currentSong} votedColor={votedColor}/>
            {/*List songbuttons*/}
            <View style={{padding: 2, backgroundColor:'rgb(253, 255, 174)'}}>
              Vote a song below to suggest the next one!
            </View>
            <View style={{ backgroundColor: "#dadada", flex:1, justifyContent:'space-around' }}>
              {/*Songbutton*/}
              {songs.map(song => (
                <SongButton song={song} voteSong={voteSong} selected={song.id === votedSong }/>
              ))}
            </View>
          </View>

        </View>
      </Card>
    );
  }
}

                {/*<TouchableHighlight onPress={() =>{console.log('press', song.id)}}>
                  <View key={song.id} style={{ flexDirection: "row" }}>
                    <View style={{ backgroundColor: song.color, padding: 5 }}>
                      red
                    </View>
                    <View>{song.title}</View>
                    <View>voted</View>
                  </View>
                </TouchableHighlight>*/}