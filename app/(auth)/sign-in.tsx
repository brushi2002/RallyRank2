import { loginwithEmail } from '@/lib/appwrite'
//import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalContext } from '@/lib/globalprovider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from 'expo-blur'
import { Link, Redirect, router } from 'expo-router'
import * as React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Dimensions, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../../constants/styles'
import { LocationData } from '../../lib/geolocationApi'

const SignIn = () => {
  const { refetch, loading, isLoggedIn } = useGlobalContext();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  // Check onboarding status on mount
  React.useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboarding === 'true') {
          setShowOnboarding(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, []);

 interface FormData {
    Email: string;
    Password: string;
  }
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({mode: 'onChange'});

  if (!loading && isLoggedIn) {
    return <Redirect href="/" />;
  }

  const handleLogin = async (data: FormData) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await loginwithEmail(data.Email, data.Password);
      await refetch();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Background */}
      <View style={styles.background}>

        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Rally Rank</Text>
          <Text style={styles.tagline} numberOfLines={1}>Your game, your rank, your rally.</Text>
        </View>

        {/* Tennis Ball Image */}
        <Image
          source={require('../../assets/images/TennisBall.png')}
          style={styles.tennisBall}
          resizeMode="cover"
        />

        {/* Tennis Court Background Image */}
        <Image
          source={require('../../assets/images/SignInScreenBackground.png')}
          style={styles.tennisCourtImage}
          resizeMode="cover"
          height={492}
        />

        {/* Form Container */}
        <View style={styles.formContainer} >
          <BlurView intensity={30} style={styles.blurContainer}>
            
            {/* Welcome Text */}
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Please login to view your Ladder or Enter Scores.
            </Text>

            <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <Controller
                  control={control}
                  name="Email"
                  rules={{
                    required: 'Email is Required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format"
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      textContentType="emailAddress"
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder=""
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                <View style={styles.inputUnderline} />
                {errors.Email && (
                  <Text style={styles.errorText}>{errors.Email.message}</Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <Controller
                  control={control}
                  name="Password"
                  rules={{
                    required: 'Password is Required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      textContentType="password"
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder=""
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      secureTextEntry
                    />
                  )}
                />
                <View style={styles.inputUnderline} />
                {errors.Password && (
                  <Text style={styles.errorText}>{errors.Password.message}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}
              > 
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Submitting...' : 'Sign in'}
                </Text>
              </TouchableOpacity>

              {/* Sign In Link */}
                <Text style={styles.signInText}>
                  Don't have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')} style={styles.signInContainer}>
                    <Text style={styles.signInLinkText}> Click here to Register</Text>
                  </TouchableOpacity>



            {/* Sign In Link */}
              <Text style={[styles.signInText, { marginTop: 15 }]}>If you would like to register and create a Ladder for your friends to join. </Text>
              <TouchableOpacity onPress={() => router.push('/CreateLadder')} style={styles.signInContainer}>
                  <Text style={styles.signInLinkText}> Click Here to Register and Create a Ladder.</Text>
              </TouchableOpacity>

                

                <Text style={[styles.signInText, { marginTop: 20 }]}>
                  If you are interested in testing, please send me an email <Link href="mailto:eric@rally-rank.com">eric@rally-rank.com</Link>
                </Text>
            </ScrollView>

            {/* Social Login Buttons */}
            {/*<View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            {/*<TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>
                Forgot your e-mail or password? 
                <Text style={styles.resetLinkText}> Reset here</Text>
              </Text>
            </TouchableOpacity>
              */}
          </BlurView>
        </View>
      </View>
    </View>
  );
}

export default SignIn;
