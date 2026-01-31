import { useGlobalContext } from '@/lib/globalprovider';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
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
      return;
    }
    const result = await loginwithOauth("Apple", city ?? '', county ?? '', state ?? '', country ?? '', deviceType ?? '');
    if (result) {
      console.log("apple login success")
      await refetch();
    }
  }

  async function handleGoogleLogin() {
    if(isLoggedIn){
      console.log("already logged in")
      return;
    }
    const result = await loginwithOauth("Google", city ?? '', county ?? '', state ?? '', country ?? '', deviceType ?? '');
    if (result) {
      await refetch()
      router.replace('/');
    }
  }

  return (
    <View style={buttonStyles.container}>
      {/* Sign In with Apple */}
      <TouchableOpacity
        style={buttonStyles.appleButton}
        onPress={handleAppleLogin}
      >
        <FontAwesome name="apple" size={20} color="#000" style={buttonStyles.appleIcon} />
        <Text style={buttonStyles.appleText} allowFontScaling={false}>Sign {txt} with Apple</Text>
      </TouchableOpacity>

      {/* Sign In with Google Button */}
      <TouchableOpacity
        style={buttonStyles.googleButton}
        onPress={handleGoogleLogin}
      >
        <AntDesign name="google" size={20} color="#4285F4" style={buttonStyles.googleIcon} />
        <Text style={buttonStyles.googleText} allowFontScaling={false}>Sign {txt} with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const buttonStyles = StyleSheet.create({
  container: {
    gap: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  appleButton: {
    width: '85%',
    maxWidth: 250,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  appleIcon: {
    marginRight: 8,
  },
  appleText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Rubik',
  },
  googleButton: {
    width: '85%',
    maxWidth: 250,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  googleIcon: {
    marginRight: 8,
  },
  googleText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Rubik',
  },
});