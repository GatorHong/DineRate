// components/ConfirmModal.jsx
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfirmModal({ visible, message, onConfirm, onCancel }) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={styles.confirm}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 32
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12
  },
  message: {
    fontSize: 16,
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancel: {
    color: 'gray',
    fontWeight: 'bold'
  },
  confirm: {
    color: 'red',
    fontWeight: 'bold'
  }
});
