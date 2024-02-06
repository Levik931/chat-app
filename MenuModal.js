import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";

const auth = FIREBASE_AUTH;

const MenuModal = ({ isVisible, onOpen, onClose, navigation }) => {
  const logoutGoogle = async () => {
    try {
      await signOut(auth);
      onClose();
      navigation.navigate("Login");
      console.log("User signed out!");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.fullScreenBlackBackground}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={null} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logoutGoogle} style={styles.menuItem}>
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
});

export default MenuModal;
