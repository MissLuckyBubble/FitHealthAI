import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: colors.backgroundWhite,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalItemImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalItemText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: colors.backgroundWhite,
    fontSize: 16,
  },
});
