import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles as globalStyles } from '../../../constants/styles';

export default function NoLeague() {
  return (
    <View style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={globalStyles.appTitle} allowFontScaling={false}>No League Yet</Text>
        <Text style={styles.message} allowFontScaling={false}>
          You aren't currently a member of any Ladder.{' '}
          <Text style={styles.linkText} onPress={() => router.push('/JoinLadder')} allowFontScaling={false}>
            Please click here to Join a Ladder
          </Text>
        </Text>
        <Text style={styles.smallMessage} allowFontScaling={false}>
          If you'd like to be involved in testing the app, please email me at:
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:eric@rally-rank.com')}>
          <Text style={styles.smallLinkText} allowFontScaling={false}>eric@rally-rank.com</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  message: {
    fontSize: 20,
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
  smallMessage: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFF',
    fontFamily: 'Rubik',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
  },
  smallLinkText: {
    fontSize: 18,
    fontFamily: 'Rubik',
    color: '#EFEEBC',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});
