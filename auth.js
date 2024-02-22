import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { TextInput } from "react-native";
import LottieView from "lottie-react-native";
import { FIREBASE_AUTH } from "./firebaseConfig";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import * as Font from "expo-font";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";

import * as Google from "expo-auth-session/providers/google";
const customFonts = {
  Crimson: require("./CrimsonText-Bold.ttf"),
};

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "629450976243-c6edbh4am9mkmvuk04vn8b7v9l6irp2q.apps.googleusercontent.com",
    // androidClientId:
    //   "629450976243-riu097jmp17vumsn9sqprc7sd6cr6pr2.apps.googleusercontent.com",
    // // webClientId:
    //   "183951813596-vsq1qfptv93rfc8sbkcprqf1g04ltj1g.apps.googleusercontent.com",
    // scopes: ["profile", "email"],
  });
  async function loadFonts() {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  const auth = FIREBASE_AUTH;

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const db = getFirestore();
      // const userRef = collection(db, "users");

      const signInWithGoogle = async () => {
        setLoading(true);
        try {
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;
          console.log("Login successful");
          // navigation.navigate("Home");
          const userData = {
            uid: user.uid,
            displayName: user.displayName || "",
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL || "",
            // Add more fields as needed
          };
          // const userDocRef = doc(db, "users", user.uid);

          // Save user data to Firestore
          await setDoc(doc(db, "users", user.uid), userData);
        } catch (error) {
          console.error(error);
          alert("Sign In Failed: " + error.message);
        } finally {
          setLoading(false);
        }
      };

      signInWithGoogle();
    }
  }, [response, navigation]);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      alert("Either username or password is incorrect, Please try again");
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
    <View style={styles.overlay}>
      <View style={styles.title}>
        <Image
          style={{
            width: 140,
            height: 140,
            marginTop: 100,
            marginRight: 30,
            marginBottom: -110,
          }}
          source={require("./chatly.png")}
        />
      </View>
      {fontsLoaded && (
        <Text
          style={{
            fontFamily: "Crimson", // Ensure this font is correctly loaded with expo-font
            color: "white",
            fontSize: 30,
            marginRight: 120,
            marginBottom: 10,
          }}
        >
          Welcome!
        </Text>
      )}
      <TextInput
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.signInButton}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.signInButton}
        secureTextEntry
      />
      <TouchableOpacity>
        <Text
          style={{
            color: "gray",
            marginBottom: 20,
            marginLeft: 130,
            marginTop: -2,
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.signInButton,
          { backgroundColor: "lightgray", marginBottom: 40 },
        ]}
        onPress={signIn}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
          style={[styles.signInButton, { backgroundColor: "gray" }]}
          onPress={() => console.log("Sign In with Google Pressed")}
        >
          <Image source={require("./github.png")} style={styles.PNG} />
          <Text style={styles.buttonText}>Continue with GitHub</Text>
        </TouchableOpacity> */}
      {/* <TouchableOpacity
        style={[
          styles.signInButton,
          { backgroundColor: "lightgray", marginBottom: 10, marginTop: 10 },
        ]}
        onPress={signUp}
      >
        <Text style={styles.loginText}>SignUp</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={[styles.signInButton, { backgroundColor: "blue" }]}
        onPress={() => {
          promptAsync();
        }}
      >
        <Image source={require("./google.png")} style={styles.PNG} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      {/* Sign In with Apple Button */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => console.log("Sign In with Apple Pressed")}
      >
        <Image source={require("./apple.png")} style={styles.PNG} />
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>
      <Text style={{ color: "gray", lineHeight: 22 }}>
        Dont have an account?{"  "}
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ color: "green", fontWeight: "bold" }}>Sign Up!</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "black", // Dark overlay to improve text visibility
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 250,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  PNG: {
    width: 24,
    height: 24,
  },
  chatIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loginText: {
    color: "black",
    textAlign: "center",
    flex: 1,
    fontWeight: "bold",
  },

  signInButton: {
    flexDirection: "row",
    // backgroundColor: "black",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    width: 250,
    alignItems: "center",
    paddingHorizontal: 20,
    color: "white",
    borderColor: "gray",
    borderWidth: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginPage;
