import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { FIREBASE_AUTH } from "./firebaseConfig";
import * as SecureStore from "expo-secure-store";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
const LoginPage = ({ navigation }) => {
  console.log("logout function in LoginPage:");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "629450976243-c6edbh4am9mkmvuk04vn8b7v9l6irp2q.apps.googleusercontent.com",
    // androidClientId:
    //   "629450976243-riu097jmp17vumsn9sqprc7sd6cr6pr2.apps.googleusercontent.com",
    // // webClientId:
    //   "183951813596-vsq1qfptv93rfc8sbkcprqf1g04ltj1g.apps.googleusercontent.com",
    // scopes: ["profile", "email"],
  });

  const auth = FIREBASE_AUTH;

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const signInWithGoogle = async () => {
        setLoading(true);
        try {
          const credential = GoogleAuthProvider.credential(id_token);
          await signInWithCredential(auth, credential);
          console.log("Login successful");
          navigation.navigate("Home");
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
      alert("Check you Email");
    } catch (error) {
      console.log(error);
      alert("Sign In Failed " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("Check you Email");
    } catch (error) {
      console.log(error);
      alert("Sign In Failed " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
      console.log("User signed out!");
      // Navigate to login screen or do other actions after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  console.log("logout function in LoginPage:", logout);

  return (
    <ImageBackground
      source={require("./loginPage.jpg")}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.title}>
          <Text style={styles.headerText}> Please Sign up or Login! </Text>
          <Image source={require("./chat.png")} style={styles.chatIcon} />
        </View>
        <TextInput
          placeholder="Email..."
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.signInButton}
        />
        <TextInput
          placeholder="Password..."
          placeholderTextColor="gray"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.signInButton}
          secureTextEntry
        />
        {/* Sign In with Google Button */}
        <TouchableOpacity
          style={[
            styles.signInButton,
            { backgroundColor: "lightgray", marginBottom: 40 },
          ]}
          onPress={() => console.log("Sign In with Google Pressed")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.signInButton,
            { backgroundColor: "lightgray", marginBottom: 40 },
          ]}
          onPress={signUp}
        >
          <Text style={styles.loginText}>SignUp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.signInButton, { backgroundColor: "gray" }]}
          onPress={() => console.log("Sign In with Google Pressed")}
        >
          <Image source={require("./github.png")} style={styles.PNG} />
          <Text style={styles.buttonText}>Continue with GitHub</Text>
        </TouchableOpacity>
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay to improve text visibility
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
    backgroundColor: "black",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: 250,
    alignItems: "center",
    paddingHorizontal: 20,
    color: "white",
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
});

export default LoginPage;
