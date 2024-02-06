import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";
import NewChatSection from "./NewChatSection";
import LoginPage from "./auth";
import HomeScreen from "./homeScreen";
import MenuModal from "./MenuModal";
import ThreeButtonComponent from "./homeScreenNavigators"; // Ensure this import is correct
import LottieView from "lottie-react-native";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("login"); // Initial screen

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentScreen("home"); // Default to home if authenticated
      } else {
        setIsAuthenticated(false);
        setCurrentScreen("login"); // Show login if not authenticated
      }
      setTimeout(() => setLoading(false), 2300);
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

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen />;
      case "login":
        return <LoginPage />;
      case "chat":
        return <NewChatSection />;
      case "menu":
        return <MenuModal />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <View style={styles.fullScreen}>
      {renderScreen()}
      {currentScreen !== "chat" && (
        <ThreeButtonComponent
          onNavigate={(screenName) => setCurrentScreen(screenName)}
          currentScreen={currentScreen}
        />
      )}
    </View>
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
    backgroundColor: "black", // Ensure this matches your desired background
  },
});

export default App;
