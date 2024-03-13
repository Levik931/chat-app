import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH } from "./firebaseConfig";
import Ionicons from "react-native-vector-icons/Ionicons";

import * as Font from "expo-font";
const customFonts = {
  Helvetica: require("./HelveticaNeueCondensedBlack.ttf"),
};
const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = getFirestore();
  async function loadFonts() {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.(com|edu|net|org|gov|mil|biz|info|app|io)$/i;
    return re.test(email);
  };
  useEffect(() => {
    loadFonts();
  }, []);
  const signUp = async () => {
    if (password !== confirmPassword) {
      alert("The passwords do not match. Please try again.");
      return;
    }
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        userName
      );
      const userInfo = {
        uid: response.user.uid,
        email: response.user.email,
        displayName: userName,
        emailVerified: response.user.emailVerified,
      };
      console.log("this is response", response.user.uid);
      await setDoc(doc(db, "users", response.user.uid), userInfo);
      alert("User Createrd Successfully");
    } catch (error) {
      console.log(error);
      alert("Sign Up Failed " + error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log("Signing up with:", email, password);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        {fontsLoaded && <Text style={styles.title}>Sign Up!</Text>}
        <View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={userName}
            onChangeText={setUserName}
            keyboardType="email-address"
            autoCapitalize="sentences"
          />
          {userName.length >= 5 && (
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="green"
              style={styles.icon}
            />
          )}
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="sentences"
          />
          {isValidEmail(email) && (
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="green"
              style={styles.icon}
            />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={{
              color: "#007BFF",
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "Helvetica",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Helvetica",
  },

  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "white",
    fontFamily: "Helvetica",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: 5,
    top: 13,
    height: 50,
    width: 30,
  },
  iconStyle: {
    position: "absolute",
    right: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Helvetica",
  },
});

export default SignUpScreen;
