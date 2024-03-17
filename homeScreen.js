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
  Alert,
  ActionSheetIOS,
} from "react-native";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import MenuModal from "./MenuModal";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { SwipeListView } from "react-native-swipe-list-view";
import { FIREBASE_AUTH } from "./firebaseConfig";
import {
  Firestore,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  find,
  deleteDoc,
  doc,
  writeBatch,
  batch,
  get,
  setDoc,
  serverTimestamp,
} from "@firebase/firestore";

const HomeScreen = ({ navigation, route }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [openSwipeable, setOpenSwipeable] = useState(null); // Track the open swipeable
  const swipeablesRef = useRef(new Map()).current; // Store refs of swipeables
  const swipeableRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const auth = FIREBASE_AUTH;
  const db = getFirestore();
  const [chats, setChats] = useState([]);
  const chatsRef = collection(db, "chats");
  const usersRef = collection(db, "users");
  const userUID = auth.currentUser.uid;
  const closeSwipeable = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
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
        where("participants", "array-contains", userUID)
      );
      const querySnapshot = await getDocs(q);

      let chatsData = [];
      for (const doc of querySnapshot.docs) {
        let chat = { id: doc.id, ...doc.data() };
        const otherUID =
          chat.participants.length === 2 &&
          chat.participants[0] === chat.participants[1]
            ? userUID
            : chat.participants.find((uid) => uid !== userUID);
        const timeAgo = formatTimeAgo(chat.lastMessageTimestamp?.toDate());
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
  }, [auth.currentUser.uid, chatsRef]);

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

  const renderRightActions = (progress, dragX, chatId) => {
    const scaleEdit = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 200],
      extrapolate: "clamp",
    });
    const scaleDelete = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flexDirection: "row", width: 150 }}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX: scaleEdit }],
            backgroundColor: "#FFC300",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => console.log("Edit")}>
            <Ionicons name="ellipsis-horizontal" size={25} color="white" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX: scaleDelete }],
            backgroundColor: "#FF4433",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => handleDelete(chatId)}>
            <Ionicons name="trash" size={25} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const handleDelete = async (chatId) => {
    console.log("Deleting chat with ID:", chatId);

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Are you sure you want to delete this chat?",
        options: ["Cancel", "Delete"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          // Cancel
        } else if (buttonIndex === 1) {
          // Delete
          try {
            const chatDocRef = doc(db, "chats", chatId);
            const messagesCollectionRef = collection(chatDocRef, "messages");

            // Delete all messages in the chat
            const querySnapshot = await getDocs(messagesCollectionRef);
            const deleteBatch = writeBatch(db);

            // Check if there are any documents before iterating
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                deleteBatch.delete(doc.ref);
              });
            } else {
              console.log("No messages found in this chat.");
            }

            await deleteBatch.commit();
            console.log("All messages deleted successfully");

            // Delete the chat document
            await deleteDoc(chatDocRef);
            console.log("Chat deleted successfully");
          } catch (error) {
            console.error("Error deleting chat: ", error);
          }
        }
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={closeSwipeable}>
      <SafeAreaView
        style={[styles.safeAreaContainer, { backgroundColor: "black" }]}
      >
        <ScrollView
          style={{ backgroundColor: "black" }} // Added backgroundColor: 'black'
          contentContainerStyle={styles.scrollViewContent}
          scrollEnabled={!isSearchActive}
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
          <Animated.View style={{ opacity: fadeAnim }}>
            {!isSearchActive && (
              <>
                {chats.map((chat, index) => {
                  const displayName = chat.otherDisplayName;
                  const lastMessage = chat.lastMessage || "No messages";
                  const renderRightActionsWithId = (progress, dragX) =>
                    renderRightActions(progress, dragX, chat.id);

                  return (
                    <Swipeable
                      key={chat.id}
                      ref={swipeableRef}
                      renderRightActions={renderRightActionsWithId}
                      overshootRight={false} // This prevents the button from overshooting
                      friction={4} // Adjust friction for smoother animation
                      leftThreshold={30} // The threshold for when the swipe left action is activated
                      rightThreshold={40} // The threshold for when the swipe right action is activated
                    >
                      <TouchableOpacity
                        style={styles.chatBox}
                        onPress={() =>
                          navigation.navigate("Chat", {
                            uid: chat.otherUID,
                            displayName: chat.otherDisplayName,
                          })
                        }
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.messageText}>{displayName}</Text>
                          <View style={{ marginRight: 30 }}>
                            <Text
                              style={{
                                color: "gray",
                                fontSize: 17,
                              }}
                            >
                              {chat.timeAgo}
                            </Text>
                          </View>
                        </View>

                        <Text style={{ color: "white", marginBottom: 10 }}>
                          {lastMessage}
                        </Text>
                      </TouchableOpacity>
                    </Swipeable>
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
    // borderBottomWidth: 0.4, // This sets the thickness of the bottom border
    // borderBottomColor: "gray",
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
  leftAction: {
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  // actionText: {
  //   color: "white",
  //   fontSize: 16,
  //   backgroundColor: "transparent",
  //   // paddingHorizontal: 5,
  // },
  // rightAction: {
  //   justifyContent: "center",
  //   alignItems: "flex-end",
  //   // backgroundColor: "#497AFC",
  //   // padding: 10,
  //   // paddingRight: 20, // Add some padding to the right for space
  // },
});

export default HomeScreen;
