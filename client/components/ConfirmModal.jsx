import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfirmModal({
  visible,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  colors,
}) {
  if (!colors) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.sectionBackground || '#222',
              borderColor: colors.border || '#444',
            },
          ]}
        >
          <Text style={[styles.message, { color: colors.text || '#fff' }]}>
            {message}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={styles.buttonWrapper}>
              <Text style={[styles.button, { color: colors.text || '#aaa' }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log(`✅ ConfirmModal: ${confirmLabel} clicked`);
                onConfirm();
              }}
              style={styles.buttonWrapper}
            >
              <Text
                style={[
                  styles.button,
                  {
                    color:
                      confirmLabel.toLowerCase().includes('delete') ||
                      confirmLabel.toLowerCase().includes('demote')
                        ? '#ff3b30' // red for destructive
                        : '#007aff', // blue for safe
                    fontWeight: 'bold',
                  },
                ]}
              >
                {confirmLabel}
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonWrapper: {
    paddingHorizontal: 10,
  },
  button: {
    fontSize: 16,
  },
});
