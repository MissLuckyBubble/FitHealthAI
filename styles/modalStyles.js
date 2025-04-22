import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 12,
  },
  modalItemImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
