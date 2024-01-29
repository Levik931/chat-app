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

const NewChatSection = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const socketRef = useRef(null);
  const allMessages = [...messages, ...receivedMessages];
  const scrollViewRef = useRef();

  const fetchMessagesFromDatabase = async () => {
    try {
      const response = await fetch("http://localhost:3000/messages");
      if (!response.ok) {
        throw new Error("Failed to fetch messages from the database");
      }
      const fetchedMessages = await response.json();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages from the database:", error);
    }
  };
  useEffect(() => {
    fetchMessagesFromDatabase();
    const socket = new WebSocket("ws://192.168.1.191:8080");

    socketRef.current = socket;

    return () => {
      socket.close();
      console.log("Server Disconnected");
    };
  }, []);

  const handleSend = () => {
    if (message.trim() === "") {
      return;
    }
    const newMessage = {
      type: "sentMessage",
      text: message,
      timestamp: new Date(),
    };

    handleNewChat(message);
    saveMessageToMongoDB(newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  const handleNewChat = (newMessage) => {
    console.log("Sent message:", newMessage);

    const socket = socketRef.current;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(newMessage)); // Send the JSON stringified newMessage
    }
  };

  const saveMessageToMongoDB = async (message) => {
    try {
      const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error("Failed to save message to MongoDB");
      }

      // The message has been successfully saved to MongoDB
      console.log("Message saved to MongoDB:", message);
    } catch (error) {
      console.error("Error saving message to MongoDB:", error);
    }
  };

  useEffect(() => {
    const socket = socketRef.current;

    const handleReceivedMessage = (event) => {
      try {
        const receivedMessage = JSON.parse(event.data);
        if (typeof receivedMessage.text === "string") {
          const newMessage = {
            type: "receivedMessage",
            text: receivedMessage.text, // Extract the text property
            timestamp: new Date(),
          };
          setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
          saveMessageToMongoDB(newMessage);
        } else {
          console.error(
            "Received message is not in the expected format:",
            receivedMessage
          );
        }
      } catch (error) {
        console.error("Error parsing received message:", error);
      }
    };
    socket.addEventListener("message", handleReceivedMessage);

    return () => {
      socket.removeEventListener("message", handleReceivedMessage);
    };
  }, []);

  allMessages.sort((a, b) => a.timestamp - b.timestamp);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // style={[styles.container, { display: isVisible ? "flex" : "none" }]}
      style={styles.container}
      // animationType="slide"
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
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
