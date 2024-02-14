import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  getFirestore,
  collection,
  query as firestoreQuery,
  where,
  getDocs,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import debounce from "lodash.debounce";
import { Navigation } from "react-native-navigation";

const UserSearch = ({
  onSelectUser,
  onSearchFocus,
  onSearchBlur,
  navigation,
}) => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  const searchUsers = async (searchValue) => {
    if (!searchValue.trim()) {
      setUsers([]);
      return;
    }
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = firestoreQuery(
      usersRef,
      where("displayName", ">=", searchValue),
      where("displayName", "<=", searchValue + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const searchedUsers = querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    setUsers(searchedUsers);
  };

  const debouncedSearchUsers = debounce((text) => searchUsers(text), 300);

  useEffect(() => {
    if (searchText) {
      debouncedSearchUsers(searchText);
    } else {
      setUsers([]);
    }

    return () => debouncedSearchUsers.cancel();
  }, [searchText]);

  const handleFocus = () => {
    setIsFocused(true);
    if (onSearchFocus) {
      onSearchFocus(); // Call the provided onSearchFocus prop function
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onSearchBlur) {
      onSearchBlur(); // Call the provided onSearchBlur prop function
    }
  };

  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={searchText}
          placeholderTextColor="#999"
          onChangeText={setSearchText}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
      </View>
      {/* Conditionally render search results if input is focused and users are found */}
      {isFocused && users.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          {users.map((user) => (
            <TouchableOpacity
              key={user.uid}
              onPress={() => {
                // onSelectUser(user.uid);
                navigation.goBack();

                setTimeout(
                  () =>
                    navigation.navigate("Chat", {
                      uid: user.uid,
                      displayName: user.displayName,
                    }),
                  2
                );
                setIsFocused(false);
              }}
              style={styles.userItem}
            >
              <Text style={styles.userText}>{user.displayName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default UserSearch;

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    color: "#E3E3E3",
    fontSize: 16,
    fontWeight: "bold",
  },
  SafeArea: {
    flex: 1,
    backgroundColor: "#242323",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#545151",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    alignItems: "center",
  },
  searchIcon: {
    paddingRight: 1,
  },
  resultsContainer: {
    // Adjust this style as needed
    maxHeight: 200,
    // backgroundColor: "#fff", // Choose a background color that fits your app theme
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#black",
  },
  userItem: {
    paddingVertical: 17,
    paddingHorizontal: 15,
    borderBottomWidth: 1, // Optional: adds a separator line between items
    borderBottomColor: "#ccc", // Optional: color for the separator line
  },
  userText: {
    color: "white", // Adjust text color to improve readability on the new background
    fontSize: 16,
    fontWeight: "bold",
  },
});
