import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
} from "firebase/firestore";
import { FIREBASE_AUTH } from "./firebaseConfig";

const NewChatSection = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [lastMesage, setLastMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const allMessages = [...messages, ...receivedMessages];
  const scrollViewRef = useRef();
  const db = getFirestore();
  const auth = FIREBASE_AUTH;
  const { uid, displayName } = route.params;
  const userUIDs = [auth.currentUser.uid, uid].sort();
  const chatId = userUIDs.join("-");
  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(db, "chats", chatId, "messages");

  const handleSend = async () => {
    if (message.trim() === "") {
      return;
    }

    const newMessage = {
      text: message,
      timestamp: serverTimestamp(),
      senderName: auth.currentUser.displayName,
      senderId: auth.currentUser.uid,
      receiverId: uid,
      receiverName: displayName,
      type: "sentMessage",
    };

    try {
      await addDoc(messagesRef, newMessage);

      // handleNewChat(newMessage);
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  // const handleNewChat = (newMessage) => {};

  // allMessages.sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    const receiverUID = route.params?.uid;
    const currentUserUID = auth.currentUser.uid;
    const userUIDs = [currentUserUID, receiverUID].sort();
    const chatId = userUIDs.join("-");
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => {
        let msg = doc.data();
        msg.type =
          msg.senderId === auth.currentUser.uid
            ? "sentMessage"
            : "receivedMessage";
        return msg;
      });
      setMessages(fetchedMessages);
      if (fetchedMessages.length > 0) {
        const lastMessage = fetchedMessages[fetchedMessages.length - 1];
        setLastMessage(lastMessage.text);
        const users = {
          participants: [auth.currentUser.uid, uid].sort(),
          senderName: auth.currentUser.displayName,
          receiverName: displayName,
          lastMessage: lastMessage.text,
          lastMessageTimestamp: lastMessage.timestamp,
        };
        setDoc(chatRef, { users }, { merge: true });
      }
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // style={[styles.container, { display: isVisible ? "flex" : "none" }]}
      style={styles.container}
      // animationType="slide"
    >
      <SafeAreaView style={styles.safeAreaContainer}>
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
        <ScrollView
          style={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
        >
          {Array.isArray(allMessages) &&
            allMessages.map((msg, index) => (
              <View
                key={index}
                style={
                  msg.type === "sentMessage"
                    ? styles.messageContainer
                    : styles.messageContainerReceived
                }
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your message..."
            style={styles.input}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          {message === "" && (
            <Text style={styles.placeholderText}>Type your message...</Text>
          )}

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
    marginTop: 55,
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
  closeButton: {
    // position: "absolute",
    top: 20,
    left: 30,
    zIndex: 10,
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
  messageText: {},
});

export default NewChatSection;
