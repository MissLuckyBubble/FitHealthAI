import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { userProfileStyles } from "../../../styles/UserProfileStyles";
import { styles } from "../../../styles/styles";
import { dietaryOptions, healthOptions } from "../../../assets/options";
import profilePic from "../../../assets/profilepic.png";

const UserProfile = ({ navigation }) => {
  const { user } = useAuth().user;

  const findOptionImage = (options, value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.image : null;
  };

  return (
    <ScrollView contentContainerStyle={userProfileStyles.container}>
      {user ? (
        <>
          <View style={userProfileStyles.profileContainer}>
            <Image
              source={profilePic}
              style={userProfileStyles.profilePicture}
            />
            <Text style={userProfileStyles.username}>{user.username}</Text>
          </View>
          <Text style={userProfileStyles.info}>
            Email: {user.email || "Not provided"}
          </Text>
          <Text style={userProfileStyles.info}>
            Birth Date: {user.birthDate || "Not provided"}
          </Text>
          <Text style={userProfileStyles.info}>
            {user.gender || "Gender not specified"}
          </Text>
          <Text style={userProfileStyles.info}>
            Height: {user.heightCM ? `${user.heightCM} cm` : "Not provided"}
          </Text>
          <Text style={userProfileStyles.info}>
            Weight: {user.weightKG ? `${user.weightKG} kg` : "Not provided"}
          </Text>
          <Text style={userProfileStyles.info}>
            Goal Weight:{" "}
            {user.goalWeight ? `${user.goalWeight} kg` : "Not provided"}
          </Text>
          <Text style={userProfileStyles.info}>
            Daily Calorie Goal:{" "}
            {user.dailyCalorieGoal
              ? `${user.dailyCalorieGoal} kcal`
              : "Not provided"}
          </Text>

          <Text style={userProfileStyles.sectionTitle}>
            Dietary Preferences
          </Text>
          <View style={userProfileStyles.dietaryContainer}>
            {user.dietaryPreferences?.map((preference) => (
              <View key={preference} style={userProfileStyles.dietaryItem}>
                <Image
                  source={findOptionImage(dietaryOptions, preference)}
                  style={userProfileStyles.dietaryImage}
                />
                <Text style={userProfileStyles.dietaryLabel}>
                  {
                    dietaryOptions.find((opt) => opt.value === preference)
                      ?.label
                  }
                </Text>
              </View>
            ))}
          </View>

          <Text style={userProfileStyles.sectionTitle}>Health Conditions</Text>
          <View style={userProfileStyles.dietaryContainer}>
            {user.healthConditions?.map((condition) => (
              <View key={condition} style={userProfileStyles.dietaryItem}>
                <Image
                  source={findOptionImage(healthOptions, condition)}
                  style={userProfileStyles.dietaryImage}
                />
                <Text style={userProfileStyles.dietaryLabel}>
                  {healthOptions.find((opt) => opt.value === condition)?.label}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Edit Profile")}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={userProfileStyles.info}>
          No user information available.
        </Text>
      )}
    </ScrollView>
  );
};

export default UserProfile;
