import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";
import LottieView from "lottie-react-native";

const auth = FIREBASE_AUTH;

const MenuModal = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const signUserOut = async () => {
    setLoading(true);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      await delay(1500);
      await signOut(auth);
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.centered}>
        <LottieView
          autoPlay
          style={{ width: "100%", height: "100%", backgroundColor: "black" }}
          source={require("./loading.json")}
        />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenBlackBackground}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={null} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signUserOut} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={null} style={styles.menuItemNoBorder}>
            <Text style={styles.menuItemText}>Save Chat</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.closeButton}
          >
            <Text style={styles.menuItemText}>Close</Text>
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
      {/* <ThreeButtonComponent /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenBlackBackground: {
    flex: 1,
    backgroundColor: "black",
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccc",
    width: "100%",
    alignItems: "center",
  },
  menuItemNoBorder: {
    padding: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "#cccc",
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 10,
  },
  menuItemText: {
    fontWeight: "bold",
    color: "white",
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MenuModal;
