import { useGlobalContext } from '@/lib/globalprovider';
import { AntDesign } from '@expo/vector-icons';
import * as AppleAuthentication from "expo-apple-authentication";
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loginwithOauth } from '../../lib/appwrite';


interface buttonProps{
  signup: boolean;
  Name: string;
  city?: string | null; 
  county?: string | null; 
  state?: string | null;
  country?: string | null; 
  deviceType?: string | null;
}

export function ExternalButtons({signup = true, city = '', county = '', state = '', country = '', deviceType = ''}) {

  const { loading, refetch, isLoggedIn } = useGlobalContext();

    if (!loading && isLoggedIn) {
      return <Redirect href="/" />;
    }

  let txt = '';
  if(signup)
    txt = "up"
  else
    txt = "in"
    

  async function handleAppleLogin() {
    if(isLoggedIn){
      console.log("already logged in")

    }
    if (await loginwithOauth("Apple", city, county, state, country, deviceType)) {
      console.log("apple login success")
      await refetch();
    }

  }

  async function handleGoogleLogin() {
    console.log('yep');
    if (await loginwithOauth("Google", city, county, state, country, deviceType)) {
      await refetch()
      router.replace('/');
    }
  }

  return (
    <View style={buttonStyles.container}>
      {/* Sign In with Apple */}
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={signup ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN }
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={25}
        style={buttonStyles.appleButton}
        onPress={handleAppleLogin}
      />

      {/* Sign In with Google Button */}
      <TouchableOpacity
        style={buttonStyles.googleButton}
        onPress={handleGoogleLogin}
      >
        <AntDesign name="google" size={20} color="#4285F4" style={buttonStyles.googleIcon} />
        <Text style={buttonStyles.googleText}>Sign {txt} with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const buttonStyles = StyleSheet.create({
  container: {
    gap: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  appleButton: {
    width: 250,
    height: 50,
  },
  googleButton: {
    width: 250,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Rubik',
  },
});