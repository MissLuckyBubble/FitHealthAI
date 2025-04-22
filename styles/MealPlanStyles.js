import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: colors.backgroundWhite,
    fontSize: 18,
    fontWeight: "bold",
  },
  itemContainer: {
    backgroundColor: colors.backgroundWhite,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  itemText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContainer: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: colors.backgroundWhite,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.textPrimary,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.textSecondary,
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
});
