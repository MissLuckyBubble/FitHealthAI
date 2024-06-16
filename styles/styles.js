// styles/styles.js
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: colors.backgroundWhite,
    fontWeight: 'bold',
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    marginBottom: 20,
  },
  pickerButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.backgroundWhite,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  modalImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});
