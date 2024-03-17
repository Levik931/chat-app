import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SignUpScreen from "./SignUpPage"; // Adjust the import path accordingly

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock navigation
const navigation = { goBack: jest.fn() };

// Mock Firebase and any other external dependencies
jest.mock("firebase/app", () => ({
  auth: jest.fn().mockReturnValue({
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({
        user: { uid: "123", email: "test@example.com", emailVerified: false },
      })
    ),
  }),
}));

// Mock Firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn().mockReturnValue({}),
  setDoc: jest.fn(() => Promise.resolve()),
  doc: jest.fn(() => ({})),
}));

// Mock Font loading
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
}));

// Now write your tests
describe("SignUpScreen", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <SignUpScreen navigation={navigation} />
    );
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm Password")).toBeTruthy();
  });

  // Add more tests here
});

// Run your tests by executing:
// npm test
