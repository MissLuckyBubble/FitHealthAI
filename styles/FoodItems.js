import { StyleSheet } from "react-native";
import { colors } from "./colors";

const foodItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: 20,
  },
  itemContainer: {
    backgroundColor: colors.primary,
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.backgroundWhite,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.backgroundWhite,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.backgroundWhite,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#999",
  },
  modalSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#444",
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalActionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalActionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  modalCloseText: {
    color: "#333",
    fontWeight: "bold",
  },
});

export { foodItemStyles };
