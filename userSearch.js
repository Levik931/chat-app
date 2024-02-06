import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  query as firestoreQuery,
  where,
  getDocs,
} from "firebase/firestore";

const UserSearch = ({ onSelectUser }) => {
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
    <View>
      <TextInput
        placeholder="Search users by name..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={searchUsers} />

      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectUser(item.uid)}>
            <Text>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default UserSearch;
