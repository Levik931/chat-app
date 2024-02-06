import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ThreeButtonComponent = ({ onNavigate, currentScreen }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onNavigate("chat")}>
        <Icon
          name={
            currentScreen === "chat"
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline"
          }
          size={40}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate("home")}>
        <Icon
          name={currentScreen === "home" ? "home" : "home-outline"}
          size={40}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate("menu")}>
        {/* Assuming menu has a filled icon version, using search as a placeholder */}
        <Icon
          name={currentScreen === "menu" ? "settings" : "settings-outline"}
          size={40}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 90,
  },
});

export default ThreeButtonComponent;
