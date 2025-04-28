import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "../../hooks/useFetch";

const PreferenceButtons = ({ itemType, itemId }) => {
  const { data, fetchData } = useFetch();
  const [status, setStatus] = useState({ liked: false, disliked: false });
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });

  useEffect(() => {
    handleFetch();
  }, [itemId]);

  const handleFetch = async () => {
    const { data: res1 } = await fetchData(
      `preferences/status?type=${itemType}&itemId=${itemId}`,
      "GET"
    );
    if (res1) setStatus(res1);
    console.log("res1", res1);

    const { data: res2 } = await fetchData(
      `preferences/counts?type=${itemType}&itemId=${itemId}`,
      "GET"
    );
    if (res2) setCounts(res2);
  };

  const toggle = async (preferenceType) => {
    await fetchData(
      `preferences/toggle?type=${itemType}&itemId=${itemId}&preferenceType=${preferenceType}`,
      "POST"
    );
    handleFetch();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, status.liked && styles.activeLike]}
        onPress={() => toggle("LIKE")}
      >
        <Ionicons
          name={status.liked ? "thumbs-up-sharp" : "thumbs-up-sharp"}
          size={20}
          color={status.liked ? "#2e7d32" : "#757575"}
        />
        <Text style={styles.countText}>{counts.likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, status.disliked && styles.activeDislike]}
        onPress={() => toggle("DISLIKE")}
      >
        <Ionicons
          name={status.disliked ? "thumbs-down-sharp" : "thumbs-down-sharp"}
          size={20}
          color={status.disliked ? "#c62828" : "#757575"}
        />
        <Text style={styles.countText}>{counts.dislikes}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  activeLike: {
    backgroundColor: "#e8f5e9",
  },
  activeDislike: {
    backgroundColor: "#ffebee",
  },
  countText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#424242",
    fontWeight: "500",
  },
});

export default PreferenceButtons;
