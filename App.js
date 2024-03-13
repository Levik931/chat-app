import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";
import NewChatSection from "./NewChatSection";
import LoginPage from "./auth";
import HomeScreen from "./homeScreen";
import MenuModal from "./MenuModal";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/Ionicons";
import UserSearch from "./userSearch";
import SignUpScreen from "./SignUpPage";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      animationEnabled: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Login") {
          iconName = focused ? "log-in" : "log-in-outline";
        } else if (route.name === "Menu") {
          iconName = focused ? "menu-outline" : "menu-outline";
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: { backgroundColor: "black" },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    {/* <Tab.Screen name="Login" component={LoginPage} /> */}
    <Tab.Screen name="Menu" component={MenuModal} />
  </Tab.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <LottieView
          autoPlay
          style={{ width: "100%", height: "100%", backgroundColor: "black" }}
          source={require("./lego.json")}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Tabs"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Chat"
                component={NewChatSection}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UserSearch"
                component={UserSearch}
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animation: "slide_from_bottom",
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ headerShown: false }}
                screenOptions={{ animation: "none" }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
                screenOptions={{ animation: "none" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default App;
