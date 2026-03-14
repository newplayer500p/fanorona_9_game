import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChoiceBar({ pendingCaptureChoice, onApproach, onWithdrawal, onCancel, theme }) {
  if (!pendingCaptureChoice) return null;

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.choiceBackground, borderColor: theme.choiceBorderColor }
    ]}>
      <Text style={[styles.label, { color: theme.choiceTextColor }]}>Type de capture :</Text>

      <TouchableOpacity
        style={[styles.choiceButton, { backgroundColor: theme.primaryButtonBackground, borderColor: theme.choiceBorderColor }]}
        onPress={onApproach}
      >
        <Ionicons name="arrow-up-circle-outline" size={16} color={theme.primaryButtonText} />
        <Text style={[styles.choiceButtonText, { color: theme.primaryButtonText }]}>Approche</Text>
      </TouchableOpacity>

      {pendingCaptureChoice.withdrawal && (
        <TouchableOpacity
          style={[styles.choiceButton, { backgroundColor: theme.secondaryButtonBackground, borderColor: theme.choiceBorderColor }]}
          onPress={onWithdrawal}
        >
          <Ionicons name="arrow-down-circle-outline" size={16} color={theme.primaryButtonText} />
          <Text style={[styles.choiceButtonText, { color: theme.primaryButtonText }]}>Retrait</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.cancelButton, { borderColor: theme.choiceBorderColor }]}
        onPress={onCancel}
      >
        <Ionicons name="close" size={18} color={theme.choiceTextColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 4,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
  },
  choiceButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 8,
  },
});