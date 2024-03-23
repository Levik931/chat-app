import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  UIManager,
  SafeAreaView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/Feather";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  addDoc,
  setDoc,
  limit,
} from "firebase/firestore";
import { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import { format } from "date-fns";
import { FIREBASE_AUTH } from "./firebaseConfig";

const NewChatSection = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const scrollViewRef = useRef();
  const db = getFirestore();
  const auth = FIREBASE_AUTH;
  const { uid, displayName } = route.params;
  const userUIDs = [auth.currentUser.uid, uid].sort();
  const chatId = userUIDs.join("-");
  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(db, "chats", chatId, "messages");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const handleSend = async () => {
    if (message.trim() === "") {
      return;
    }

    const newMessage = {
      text: message,
      timestamp: new Date(),
      senderName: auth.currentUser.displayName,
      senderId: auth.currentUser.uid,
      receiverId: uid,
      receiverName: displayName,
      type: "sentMessage",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      await addDoc(messagesRef, {
        ...newMessage,
        timestamp: serverTimestamp(), // Use serverTimestamp for the database
      });
      const users = {
        participants: [auth.currentUser.uid, uid].sort(),
        senderName: auth.currentUser.displayName,
        receiverName: displayName,
        lastMessage: newMessage.text,
        lastMessageTimestamp: newMessage.timestamp,
        deleted: false,
      };
      setDoc(chatRef, users, { merge: true });

      setMessage("");
      fadeAnim.setValue(0); // Reset the animation value
      fadeIn(); // Trigger the animation
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  useEffect(() => {
    // Initial fetch to populate the messages
    const fetchMessages = async () => {
      const q = query(messagesRef, orderBy("timestamp"));
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map((doc) => {
        let msg = doc.data();
        msg.type =
          msg.senderId === auth.currentUser.uid
            ? "sentMessage"
            : "receivedMessage";
        return msg;
      });
      setMessages(fetchedMessages);
    };

    fetchMessages().catch(console.error);

    // onSnapshot subscription
    const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let msg = change.doc.data();
          msg.type =
            msg.senderId === auth.currentUser.uid
              ? "sentMessage"
              : "receivedMessage";
          // Filter out sent messages to avoid duplication
          if (msg.type === "receivedMessage") {
            setMessages((prevMessages) => [...prevMessages, msg]);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [route.params?.uid, auth.currentUser.uid]); // Dependencies

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      // animationType="slide"
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#FFFFFF"
              width={30}
              height={30}
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.title}>{displayName}</Text>
        </View>
        <ScrollView
          style={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
        >
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              // console.log("MESSAGE: ", msg),
              <View
                key={index}
                style={[
                  msg.type === "sentMessage"
                    ? styles.messageContainer
                    : styles.messageContainerReceived,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
                {msg.timestamp && (
                  <Text style={styles.messageTimestamp}>
                    {format(
                      msg.timestamp instanceof Date
                        ? msg.timestamp
                        : msg.timestamp.toDate(),
                      "p"
                    )}
                  </Text>
                )}
              </View>
            ))}
          {/* {lastMessage && (
            <Animated.View
              style={[
                { opacity: fadeAnim },
                lastMessage.type === "sentMessage"
                  ? styles.messageContainer
                  : styles.messageContainerReceived,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={styles.messageText}>{lastMessage.text}</Text>
              <Text style={styles.messageTimestamp}>
                {format(new Date(), "p")}
              </Text>
            </Animated.View>
          )} */}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your message..."
            style={styles.input}
            multiline
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={"#ccc"}
          />

          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 4,
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    // marginBottom: 10,
    flex: 1,
    color: "white",
    // placeholderTextColor: "#ccc",
    // paddingBottom:
    paddingTop: 13,
  },
  safeAreaContainer: {
    flex: 1,
  },
  placeholderText: {
    color: "#cccc",
    position: "absolute",
    // top: 7,
    left: 38,
  },

  scrollViewContent: {
    marginTop: 18,
    marginBottom: 20,
    flexGrow: 1,
  },
  sendButton: {
    position: "absolute",
    right: 25,
    top: 24,
    backgroundColor: "purple",
    padding: 8,
    borderRadius: 10,
  },

  sendButtonText: {
    fontWeight: "bold",
    color: "white",
  },

  messageContainer: {
    marginHorizontal: 20,
    padding: 6,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: "flex-end",
    maxWidth: "80%",
    justifyContent: "center",
    height: 30,
  },

  messageContainerReceived: {
    marginHorizontal: 20,
    padding: 6,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 200, 0.8)",
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
    maxWidth: "80%",
    justifyContent: "center",
    height: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  closeButton: {
    marginRight: 8,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,
  },
  messageTimestamp: {
    fontSize: 12,
    color: "gray",
    marginLeft: 10,
    paddingTop: 5,
  },
});

export default NewChatSection;
