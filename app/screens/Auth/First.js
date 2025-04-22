import React from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";

const First = ({ navigation }) => {
  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      navigation.navigate("Welcome");
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require("../../../assets/videos/intro.mp4")}
        style={styles.video}
        resizeMode="cover"
        isLooping={false}
        shouldPlay
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default First;
