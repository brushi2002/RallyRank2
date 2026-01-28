import { useGlobalContext } from '@/lib/globalprovider';
import { BlurView } from 'expo-blur';
import { Link, Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExternalButtons } from '../../components/auth/ExternalButtons';
import { doesEmailExist, registerUser } from '../../lib/appwrite';
import { LocationData, getLocationData } from '../../lib/geolocationApi';

const Register = () => {

  const { refetch, loading, isLoggedIn } = useGlobalContext();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [leagueCode, setLeagueCode] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors }, setError } = useForm<FormData>({mode: 'onChange'});
  const [isEmailSignUp, setisEmailSignUp] = useState(false)
  const [isEmailEntered, setisEmailEntered] = useState(false)
  
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await getLocationData();
        setLocation(locationData);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation(null);
      }
    };
    fetchLocation();
  }, []);

  interface FormData {
    Name: string;
    Email: string;
    Password: string;
  }

  const [fData, setfData] = useState({ Name: '', Email: '', Password: ''})

  if (!loading && isLoggedIn) {
    return <Redirect href="/" />;
  }

  const serverValidation = async (data: FormData, errors: any) => {
    console.log('Running Sever side Validations')
    try{
      if(await doesEmailExist(data.Email)) {
        setError('Email', {message: 'Email already exists'});
        return false;
      }
      return true;
    }
    catch(error){
      console.log('Error running server side validations', error);
    }
  }

  const handleRegisterOne = async() => {
    setisEmailSignUp(true)

  }

  const handleRegisterTwo = async(data: FormData) => {
    console.log('yep');
    try {
      if(!await serverValidation(data, errors)) {
        return;
      }
      setisEmailEntered(true);
      setfData({Name: data.Name, Email: data.Email, Password: fData.Password})
    }
    catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }

  }

  {/* 3rd Click */}
  const handleRegisterThree = async (data: FormData) => {
    
    if (isLoading) return;
    console.log('Register attempt with:', data);
    
    try {
      if(!await serverValidation(data, errors)) {
        return;
      }
      setIsLoading(true);
      const regex = /^([a-zA-Z0-9]{5})$/;

      if (!location) {
        Alert.alert('Error', 'Location data not available. Please try again.');
        return;
      }
      console.log("fData = " + fData)
      const result = await registerUser(fData.Email, data.Password, fData.Name, location.City, location.County, location.State, location.Country, location.DeviceType);
      if(result == null){
        console.log('Unable to register User, Please try again.');
        return;
      }
      
      setLeagueCode('');
      Alert.alert('Success', 'Registration successful! Please login.');
      router.push('/sign-in');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
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
          <Text style={styles.appTitle}>Join Rally Rank</Text>
        </View>

        {/* Tennis Ball Image */}
        <Image
          source={require('../../assets/images/TennisBall.png')}
          style={styles.tennisBall}
          resizeMode="cover"
        />

        {/* Tennis Court Background Image */}
        <Image
          source={require('../../assets/images/SignUpScreenBackground.png')}
          style={styles.tennisCourtImage}
          resizeMode="cover"
          height={492}
        />

        {/* Form Container */}
        <View style={styles.formContainer} >
          <BlurView intensity={30} style={styles.blurContainer}> 
            {!isEmailSignUp && !isEmailEntered && (
            <View style={{ marginTop: 40 }}>   
              {/* Welcome Text */}
              <Text style={styles.welcomeTitle}>Welcome!</Text>
              <Text style={styles.welcomeSubtitle}>
                If you'd like to test the app, please email me at
              </Text>
              <Link href="mailto:eric@rally-rank.com">
                <Text style={styles.signInLinkText}>eric@rally-rank.com</Text>
              </Link>
            </View>
             )}

            {/* Email */}
              {isEmailSignUp && !isEmailEntered && (
                <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <Controller
                  control={control}
                  name="Name"
                  rules={{
                    required: 'Name is Required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder=""
                      placeholderTextColor="rgba(255,255,255,0.4)"
                    />
                  )}
                />
                <View style={styles.inputUnderline} />
                {errors.Name && (
                  <Text style={styles.errorText}>{errors.Name.message}</Text>
                )}
                <Text style={styles.inputLabel}>Email</Text>
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

                 {/* Register Button Two - Already selected Sign Up With Email*/}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(handleRegisterTwo)}
                    disabled={isLoading}
                    >
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'Registering...' : 'Sign Up With Email'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Password */}
              {isEmailEntered && <View style={styles.inputGroup}>
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
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(handleRegisterThree)}
                    disabled={isLoading}
                    >
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'Registering...' : 'Sign Up With Email'}
                    </Text>
                  </TouchableOpacity>
              </View>}
              
              {/* Buttons Container */}
              {!isEmailSignUp && (
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(handleRegisterOne)}
                    disabled={isLoading}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Registering...' : 'Sign Up With Email'}
                    </Text>
                  </TouchableOpacity>

                  {/* External Login Buttons */}
                  <ExternalButtons signup={true} city={location?.City} county={location?.County} state={location?.State} country={location?.Country} deviceType={location?.DeviceType} />
                </View>
              )}
              

              {/* Sign In Link */}
              <TouchableOpacity onPress={() => router.push('/sign-in')} style={styles.signInContainer}>
                <Text style={styles.signInText}>
                  Already have an account? 
                  <Text style={styles.signInLinkText}> Click here to sign in</Text>
                </Text>
              </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#316536',
  },
  background: {
    flex: 1,
    backgroundColor: '#316536',
    position: 'relative',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '400',
    color: '#FFF',
    fontFamily: 'Rubik',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFF',
    fontFamily: 'Rubik',
    textAlign: 'center',
    marginTop: 8,
  },
  tennisBall: {
    position: 'absolute',
    top: 150,
    right: -20,
    width: 180,
    height: 126,
    transform: [{ rotate: '17.812deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tennisCourtImage: {
    position: 'absolute',
    bottom: -100,
    left: -40,
    width: 450,
    height: 250,
    opacity: 0.8,
  },
  formContainer: {
    position: 'absolute',
    left: 0,
    top: 196,
    width: 348,
    height: 600,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFF',
    fontFamily: 'Rubik',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFF',
    fontFamily: 'Rubik',
    marginBottom: 20,
    lineHeight: 16,
  },
  formScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Rubik',
    marginBottom: 2,
  },
  input: {
    height: 30,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Rubik',
    paddingVertical: 0,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#FFF',
    marginTop: 5,
    width: 227,
  },
  phoneInputContainer: {
    backgroundColor: 'transparent',
  },
  phoneContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: 30,
  },
  phoneInput: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Rubik',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Rubik',
  },
  submitButton: {
    width: 250,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 12,
  },
  submitButtonText: {
    color: '#316536',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Rubik',
  },
  buttonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signInContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  signInText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Rubik',
    textAlign: 'center',
  },
  signInLinkText: {
    color: '#EFEEBC',
    textDecorationLine: 'underline',
  },
});

export default Register; 