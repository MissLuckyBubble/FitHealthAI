// components/ButtonWithInput.js

import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/styles";

const ButtonWithInput = ({
  placeholder,
  value,
  onTextPress,
  onButtonPress,
}) => (
  <View style={styles.inputWithButton}>
    <TouchableOpacity style={{ flex: 1 }} onPress={onTextPress}>
      <TextInput
        placeholder={placeholder}
        style={{ flex: 1 }}
        value={value}
        editable={false}
        pointerEvents="none"
      />
    </TouchableOpacity>
    <TouchableOpacity style={styles.inputButton} onPress={onButtonPress}>
      <Ionicons name="search" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

export default ButtonWithInput;
