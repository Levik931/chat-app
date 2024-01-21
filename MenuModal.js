// MenuModal.js
import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

const MenuModal = ({ isVisible, onOpen, onClose, onMenuItemPress }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.menuContainer}>
        <TouchableOpacity
          onPress={() => onMenuItemPress("Edit")}
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onMenuItemPress("Log Out")}
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onMenuItemPress("Save Chat")}
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Save Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.menuItemText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 10,
  },
  menuItemText: {
    fontWeight: "bold",
  },
});

export default MenuModal;
