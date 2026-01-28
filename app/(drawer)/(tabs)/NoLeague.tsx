import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles as globalStyles } from '../../../constants/styles';

export default function NoLeague() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.content}>
          <Text style={globalStyles.appTitle}>No League Yet</Text>
          <Text style={styles.message}>
            You aren't currently a member of any Ladder or League. Please check back for additional functionality on being able to find players.
          </Text>
          <Text style={styles.message}>
            If you'd like to be involved in testing the app, please email me at:
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:eric@rally-rank.com')}>
            <Text style={styles.linkText}>eric@rally-rank.com</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFF',
    fontFamily: 'Rubik',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Rubik',
    color: '#EFEEBC',
    textDecorationLine: 'underline',
    marginTop: 12,
  },
});
