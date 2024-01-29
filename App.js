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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MenuModal from "./MenuModal";
import NewChatSection from "./NewChatSection";
import LoginPage from "./auth";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";
import LottieView from "lottie-react-native";
import HomeScreen from "./homeScreen";

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setIsAuthenticated(!!user);
      // Remove the direct setLoading(false) here
      setTimeout(() => setLoading(false), 2500);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          // ref={animation}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
          source={require("./lego.json")}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Chat"
          component={NewChatSection}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }} // Normal stack effect for Chat screen
        />

        <Stack.Screen name="Login" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // animationContainer: {
  //   backgroundColor: "#fff",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   flex: 1,
  // },
});

export default App;
