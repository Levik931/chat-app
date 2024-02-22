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

  async function loadFonts() {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

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
      console.log(response);
      alert("User Createrd Successfully");
    } catch (error) {
      console.log(error);
      alert("Sign In Failed " + error.message);
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

        <TextInput
          style={styles.input}
          placeholder="User name"
          placeholderTextColor="#999"
          value={userName}
          onChangeText={setUserName}
          keyboardType="email-address"
          autoCapitalize="sentences"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="sentences"
        />

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
