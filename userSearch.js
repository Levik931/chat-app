import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  getFirestore,
  collection,
  query as firestoreQuery,
  where,
  getDocs,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

const UserSearch = ({ onSelectUser, onSearchFocus, onSearchBlur }) => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);

  const searchUsers = async () => {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = firestoreQuery(
      usersRef,
      where("displayName", ">=", searchText),
      where("displayName", "<=", searchText + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    const searchedUsers = querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    setUsers(searchedUsers);
  };

  const handleSelectUser = (uid) => {
    onSelectUser(uid);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search"
        style={styles.searchInput}
        value={searchText}
        placeholderTextColor="#999"
        onChangeText={(text) => setSearchText(text)}
        onFocus={onSearchFocus} // Use the prop here
        onBlur={onSearchBlur} // And here
      />
      <Icon name="search" size={20} color="#999" style={styles.searchIcon} />

      {/* <FlatList
        data={users}
        // horizontal={true}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectUser(item.uid)}>
            <Text>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      /> */}
    </View>
  );
};

export default UserSearch;

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    // paddingRight: 10,
    color: "#E3E3E3",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#545151",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  searchIcon: {
    // Add padding if needed, for touchable area and alignment
    paddingRight: 1,
  },
});

{
  /* <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectUser(item.uid)}>
            <Text>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      /> */
}
