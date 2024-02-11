import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  LayoutAnimation,
  UIManager,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MenuModal from "./MenuModal";
import UserSearch from "./userSearch";
import ChatSearch from "./chatSearch_pleaseModify";

const HomeScreen = ({ navigation }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for other content

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  useEffect(() => {
    // Configure the animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (isSearchActive) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isSearchActive]);

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <SafeAreaView
        style={[styles.safeAreaContainer, { backgroundColor: "black" }]}
      >
        <ScrollView
          style={[styles.scrollViewStyle, { backgroundColor: "black" }]} // Added backgroundColor: 'black'
          contentContainerStyle={styles.scrollViewContent}
          scrollEnabled={!isSearchActive} // Disable scrolling when search is active
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {!isSearchActive && (
              <View style={styles.messagesHeaderContainer}>
                <Text style={styles.messagesHeading}>Messages</Text>
                <TouchableOpacity
                  style={styles.newChatIconContainer}
                  onPress={() => navigation.navigate("UserSearch")}
                >
                  <Ionicons name="add-circle-outline" size={40} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          <ChatSearch
            onSearchFocus={() => setIsSearchActive(true)}
            onSearchBlur={() => setIsSearchActive(false)}
            onSelectUser={(uid) => navigation.navigate("Chat", { uid })}
          />

          <Animated.View style={{ opacity: fadeAnim }}>
            {!isSearchActive && (
              <>
                <TouchableOpacity style={styles.chatBox}>
                  <Text style={styles.messageText}>View</Text>
                </TouchableOpacity>
                {/* Repeat for other components */}
              </>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  safeAreaContainer: {
    flex: 1,
    // marginTop: 50,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  menuButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    marginBottom: 20,
  },
  menuButtonText: {
    fontWeight: "bold",
  },
  newChatIcon: {
    padding: 10,
  },
  messageContainer: {
    marginHorizontal: 20,
    padding: 9,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  chatBox: {
    // flex: 1,
    backgroundColor: "#545151",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 16,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  messageText: {
    fontWeight: "bold",
    color: "#E9E9E9",
  },
  messagesHeading: {
    fontSize: 32, // Larger font size
    fontWeight: "bold", // Bold font weight
    // textAlign: "left", // Center align text
    marginVertical: 20, // Add some vertical margin
    color: "white", // White color text for visibility
    marginLeft: 12,
    // fontFamily: "YourCustomFontFamily", // Uncomment and replace with your custom font if you have one
  },

  messagesHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10, // Adjust padding as needed
    marginBottom: 10, // Space below the header
  },
  newChatIconContainer: {
    // Style for the touchable opacity around the icon
    marginTop: 10, // Space from the heading
    padding: 10, // Adjust padding for touch area
  },
});

export default HomeScreen;
