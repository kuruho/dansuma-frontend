// @flow
import React from "react";
import { Text, View, TouchableHighlight, Image } from "react-native";

const style = {
  container: {
    justifyContent: "center",
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 5
  },
  colorArea: {
    height: 40,
    padding: 5
  },
  songTextArea: {
    marginLeft: 5,
    fontSize: 20,
    justifyContent: "center",
    flex: 1
  },
  votedArea: {
    marginLeft: 5,
    justifyContent: "center",
    fontSize: 30
  }
};

export default function SongButton(props) {
  // console.log(props.currentSong)
  const { song, voteSong, selected } = props;
  const votedSymbol = selected ? "«" : " ";
  return (
    <TouchableHighlight
      style={style.container}
      underlayColor={song.color}
      onPress={() => {
        voteSong(song.id);
        {
          /*console.log("press", song.id);*/
        }
      }}
    >
      <View key={song.id} style={{ flexDirection: "row" }}>
        <View
          style={[style.colorArea, { backgroundColor: song.color, width: 25 }]}
        />

        <View style={style.songTextArea}>{song.title} - {song.author}</View>
        <View style={style.votedArea}> {votedSymbol}</View>
      </View>
    </TouchableHighlight>
  );
}
