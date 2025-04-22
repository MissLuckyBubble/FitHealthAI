import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    padding: 30,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingHorizontal: 30,
    paddingBottom: 40,
    backgroundColor: colors.backgroundLight,
  },
  logo: {
    width: 150,
    height: 155,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    height: 50,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    elevation: 4,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: colors.backgroundWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputWithButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    height: 50,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: colors.backgroundWhite,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    elevation: 4,
  },
  inputButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
  },

  pickerButton: {
    height: 50,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    elevation: 4,
    alignContent: "center",
    justifyContent: "center",
  },

  pickerButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  ingredientInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  inputSmall: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  pickerButtonHalf: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.backgroundWhite,
    justifyContent: "center",
  },

  ingredientList: {
    marginTop: 16,
    gap: 5,
  },

  ingredientCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 18,
    padding: 10,
    marginBottom: 8,
    flexDirection: "row",
    width: "280",
  },

  ingredientText: {
    fontSize: 14,
    color: colors.primary,
  },

  removeText: {
    fontSize: 18,
    color: colors.error,
    paddingHorizontal: 8,
  },

  clearButton: {
    backgroundColor: colors.error,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: "center",
  },
});
