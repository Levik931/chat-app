import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MenuModal from "./MenuModal";
import UserSearch from "./userSearch";
import ThreeButtonComponent from "./homeScreenNavigators";
import peakpx from "./peakpx.jpg";

const HomeScreen = ({ navigation }) => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  // const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  // const handleMenuItemPress = (item) => {
  //   console.log(`Pressed ${item}`);
  //   closeMenu();
  // };

  // const openMenu = () => {
  //   setMenuVisibility(true);
  // };

  // const closeMenu = () => {
  //   setMenuVisibility(false);
  // };

  // const handleUserSelect = (uid) => {
  //   console.log("Selected user UID:", uid);
  //   //Here you can initiate the chat using the selected user's UID
  // };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.messagesHeading}>Messages</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            onChangeText={(text) => console.log(text)} // Replace with your actual search handling logic
          />
          <Icon
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
        </View>
        <TouchableOpacity style={styles.chatBox}>
          <Text style={styles.messageText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatBox}>
          <Text style={styles.messageText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatBox}>
          <Text style={styles.messageText}>View</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {/* <ThreeButtonComponent /> */}

      {/* </ScrollView>
        </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  // animationContainer: {
  //   backgroundColor: "#fff",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   flex: 1,
  // },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  safeAreaContainer: {
    flex: 1,
    marginTop: 50,
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
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#545151",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    paddingRight: 10,
    color: "#E3E3E3",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
