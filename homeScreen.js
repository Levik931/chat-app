import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  LayoutAnimation,
  UIManager,
} from "react-native";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import MenuModal from "./MenuModal";
// import ChatSearch from "./chatSearch_pleaseModify";
import { FIREBASE_AUTH } from "./firebaseConfig";
import {
  Firestore,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  find,
} from "@firebase/firestore";

const HomeScreen = ({ navigation, route }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const auth = FIREBASE_AUTH;
  const db = getFirestore();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const userUID = auth.currentUser.uid;
      const chatsRef = collection(db, "chats");
      const usersRef = collection(db, "users");
      function formatTimeAgo(date) {
        const now = new Date();
        const diffMinutes = differenceInMinutes(now, date);
        const diffHours = differenceInHours(now, date);
        const diffDays = differenceInDays(now, date);

        if (diffDays >= 1) {
          if (diffDays === 1) {
            return "Yesterday";
          } else {
            return `${diffDays} d`;
          }
        } else if (diffHours >= 1) {
          return `${diffHours}h`;
        } else if (diffMinutes >= 1) {
          return `${diffMinutes}m`;
        } else {
          return "Just now";
        }
      }

      const q = query(
        chatsRef,
        where("users.participants", "array-contains", userUID)
      );
      const querySnapshot = await getDocs(q);

      let chatsData = [];
      for (const doc of querySnapshot.docs) {
        let chat = { id: doc.id, ...doc.data() };

        const otherUID = chat.users.participants.find((uid) => uid !== userUID);
        const timeAgo = formatTimeAgo(chat.users.lastMessageTimestamp.toDate());
        const userQuery = query(usersRef, where("uid", "==", otherUID));
        const userQuerySnapshot = await getDocs(userQuery);
        let otherDisplayName = "Unknown User";
        userQuerySnapshot.forEach((userDoc) => {
          const fullName = userDoc.data().displayName || "Unknown";
          const firstName = fullName.split(" ")[0];
          otherDisplayName = firstName;
        });

        chat.otherDisplayName = otherDisplayName;
        chat.otherUID = otherUID;
        chat.timeAgo = timeAgo;
        chatsData.push(chat);
      }

      setChats(chatsData);
    };

    fetchChats();
  }, [auth.currentUser.uid]);

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (isSearchActive) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isSearchActive]);
  // console.log("CHATS", chats);
  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <SafeAreaView
        style={[styles.safeAreaContainer, { backgroundColor: "black" }]}
      >
        <ScrollView
          style={[styles.scrollViewStyle, { backgroundColor: "black" }]} // Added backgroundColor: 'black'
          contentContainerStyle={styles.scrollViewContent}
          scrollEnabled={!isSearchActive} // Disable scrolling when search is active
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {!isSearchActive && (
              <View style={styles.messagesHeaderContainer}>
                <Text style={styles.messagesHeading}>Messages</Text>
                <TouchableOpacity
                  style={styles.newChatIconContainer}
                  onPress={() => navigation.navigate("UserSearch")}
                >
                  <Ionicons name="add-circle-outline" size={40} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          {/* <ChatSearch
            onSearchFocus={() => setIsSearchActive(true)}
            onSearchBlur={() => setIsSearchActive(false)}
            onSelectUser={(uid) => navigation.navigate("Chat", { uid })}
          /> */}
          <Animated.View style={{ opacity: fadeAnim }}>
            {!isSearchActive && (
              <>
                {chats.map((chat) => {
                  // Separately handle the display of the other party's display name and the last message
                  const displayName = chat.otherDisplayName;
                  const lastMessage = chat.users.lastMessage || "No messages";

                  return (
                    <TouchableOpacity
                      key={chat.id}
                      style={styles.chatBox}
                      onPress={() =>
                        navigation.navigate("Chat", {
                          uid: chat.otherUID,
                          displayName: chat.otherDisplayName,
                        })
                      }
                    >
                      <Text style={[styles.messageText]}>
                        {displayName}
                        {"  "}
                        <Text
                          style={{
                            color: "gray",
                            fontSize: 12,
                            marginLeft: 10,
                          }}
                        >
                          {chat.timeAgo}
                        </Text>
                      </Text>

                      <Text style={{ color: "white", marginBottom: 10 }}>
                        {lastMessage}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  safeAreaContainer: {
    flex: 1,
    // marginTop: 50,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  menuButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    marginBottom: 20,
  },
  menuButtonText: {
    fontWeight: "bold",
  },
  newChatIcon: {
    padding: 10,
  },
  messageContainer: {
    marginHorizontal: 20,
    padding: 9,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  chatBox: {
    // flex: 1,
    // backgroundColor: "#545151",
    borderRadius: 10,
    padding: 8,
    // paddingVertical: 16,
    marginHorizontal: 10,
    marginBottom: 5,
    borderBottomWidth: 1, // This sets the thickness of the bottom border
    borderBottomColor: "gray",
  },
  messageText: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    fontSize: 18,
  },
  messagesHeading: {
    fontSize: 32, // Larger font size
    fontWeight: "bold", // Bold font weight
    // textAlign: "left", // Center align text
    marginVertical: 20, // Add some vertical margin
    color: "white", // White color text for visibility
    marginLeft: 12,
    // fontFamily: "YourCustomFontFamily", // Uncomment and replace with your custom font if you have one
  },

  messagesHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10, // Adjust padding as needed
    marginBottom: 10, // Space below the header
  },
  newChatIconContainer: {
    // Style for the touchable opacity around the icon
    marginTop: 10, // Space from the heading
    padding: 10, // Adjust padding for touch area
  },
  boldText: {
    fontWeight: "bold",
    // Any additional styles for the display name
  },
});

export default HomeScreen;
