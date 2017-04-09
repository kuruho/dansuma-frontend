import React from "react";
import { View, Text } from "react-native";

 const style = {
  flex: 5,
  justifyContent: "center",
  alignItems: "center"
};

export default function Display(props) {
  // console.log(props.currentSong)
  const {currentSong, votedColor} = props
  return (
    <View style={[style, { backgroundColor: votedColor ? votedColor : '#eee'}]}>
      Now playing: <Text style={{fontWeight:600, fontSize: 20}}>{currentSong.title} - {currentSong.author}</Text>
    </View>
  );
}