// import React from "react";
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Text,
//   StyleSheet,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";

// const SearchComponent = ({
//   searchText,
//   setSearchText,
//   searchUsers,
//   users,
//   handleSelectUser,
// }) => {
//   return (
//     <View style={{ alignItems: "center", justifyContent: "center" }}>
//       <View style={styles.searchContainer}>
//         <TextInput
//           autoFocus
//           placeholder="Search"
//           style={styles.searchInput}
//           value={searchText}
//           placeholderTextColor="#999"
//           onChangeText={(text) => setSearchText(text)}
//           returnKeyType="search"
//           onSubmitEditing={searchUsers} // Trigger search when the search key is pressed
//         />
//         <TouchableOpacity onPress={searchUsers}>
//           <Icon
//             name="search"
//             size={20}
//             color="#999"
//             style={styles.searchIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={users}
//         keyExtractor={(item) => item.uid}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleSelectUser(item.uid)}>
//             <Text style={{ color: "#000", margin: 10 }}>
//               {item.displayName}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   searchInput: {
//     flex: 1,
//     color: "#E3E3E3",
//     fontSize: 16,
//     fontWeight: "bold",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//     marginRight: 10, // Ensure some spacing between the input and the search icon
//   },
//   searchContainer: {
//     flexDirection: "row",
//     backgroundColor: "#545151",
//     borderRadius: 10,
//     padding: 10,
//     paddingHorizontal: 15,
//     margin: 10,
//     width: "100%", // Adjust if necessary for your layout
//     alignItems: "center",
//   },
//   searchIcon: {
//     padding: 5,
//   },
// });

// export default SearchComponent;
