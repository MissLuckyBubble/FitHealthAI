import React from "react";
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import { modalStyles } from "../../styles/modalStyles";
import { colors } from "../../styles/colors";

const SingleChoicePicker = ({
  modalVisible,
  setModalVisible,
  options,
  handleSelect,
  selectedValue,
}) => {
  const renderModalItem = ({ item }) => {
    const isSelected = selectedValue === item.value;
    return (
      <TouchableOpacity
        style={[
          modalStyles.modalItem,
          isSelected ? { backgroundColor: colors.secondary } : {},
        ]}
        onPress={() => handleSelect(item)}
      >
        <Text style={modalStyles.modalItemText}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <FlatList
            data={options}
            renderItem={renderModalItem}
            keyExtractor={(item) => item.value}
          />
          <TouchableOpacity
            style={[modalStyles.button, { marginTop: 20 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={modalStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SingleChoicePicker;
