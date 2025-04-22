import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const userProfileStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  info: {
    fontSize: 18,
    color: colors.backgroundWhite,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  dietaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  dietaryItem: {
    alignItems: "center",
    margin: 5,
  },
  dietaryImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  dietaryLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  buttonText: {
    color: colors.backgroundWhite,
    fontSize: 18,
    fontWeight: "bold",
  },
});
2;
