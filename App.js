import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MenuModal from "./MenuModal";
import NewChatSection from "./NewChatSection";
import LoginPage from "./auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={NewChatSection} />
        <Stack.Screen name="Login" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  // const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const handleMenuItemPress = (item) => {
    console.log(`Pressed ${item}`);
    closeMenu();
  };

  const openMenu = () => {
    setMenuVisibility(true);
  };

  const closeMenu = () => {
    setMenuVisibility(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <ImageBackground
        source={require("./pic.jpg")}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.container}>
            <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.newChatIcon}
            >
              <Icon name="comment" size={30} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.chatBox}>
            <Text>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatBox}>
            <Text>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatBox}>
            <Text>View</Text>
          </TouchableOpacity>

          <MenuModal
            isVisible={isMenuVisible}
            onOpen={openMenu}
            onClose={closeMenu}
            onMenuItemPress={handleMenuItemPress}
          />
        </SafeAreaView>
      </ImageBackground>
      {/* </ScrollView>
      </KeyboardAvoidingView> */}
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 16,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  messageText: {
    fontWeight: "bold",
  },
});

export default App;
