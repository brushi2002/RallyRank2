import { addUsertoLadder, getLadderIDforLadderCode } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/globalprovider';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles as globalStyles } from '../../../constants/styles';

const JoinLadder = () => {
  const { user, refetch } = useGlobalContext();
  const [leagueCode, setLeagueCode] = useState('');
  const { control, handleSubmit, formState: { errors }, setError } = useForm<FormData>({mode: 'onChange'});
  let ladderid = '';

  interface FormData {
    LadderCode: string;
  }


  const serverValidation = async (data: FormData, errors: any) => {
    console.log('Running Server side Validations')
    try{
      ladderid = await getLadderIDforLadderCode(data.LadderCode);
      if(ladderid == '') {
        setError('LadderCode', {message: 'Ladder Code does not exist'});
        return false;
      }
      else
        return true;
    }
    catch(error){
      console.log('Error running server side validations', error);
    }
  }


  const handleJoinLadder = async (data: FormData) => {
    if(await serverValidation(data, errors)){
      // Add User to Ladder
      console.log(user?.$id);
      if(user?.$id == null)
        console.log("error, user doesn't exist")
      else
      {
        if(await addUsertoLadder(user?.$id, ladderid))
        {
          console.log('user id = ' + user?.$id);
          await refetch(); // Refresh user data to update isLeagueMember
          router.replace("/");
        }
      }
    }
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={globalStyles.appTitle} allowFontScaling={false}>Join a Ladder</Text>
        <Text style={styles.message} allowFontScaling={false}>
          Please Enter the Ladder Code. You can get this from your Ladder Captain.
        </Text>
        <Text style={styles.inputLabel} allowFontScaling={false}>Ladder Code</Text>
          <Controller
            control={control}
            name="LadderCode"
            rules={{
              required: 'Ladder Code is Required',
              minLength: {
                value: 4,
                message: 'Ladder Code must be 4 Characters long'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter 4-letter code"
                placeholderTextColor="rgba(255,255,255,0.5)"
                maxLength={4}
                autoCapitalize="characters"
              />
            )}
          />
          {errors.LadderCode && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.LadderCode.message}
            </Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(handleJoinLadder)}
          >
            <Text style={styles.submitButtonText} allowFontScaling={false}>
              Join Ladder
            </Text>
          </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default JoinLadder;

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
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    fontFamily: 'Rubik',
    marginTop: 24,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Rubik',
    paddingHorizontal: 16,
    textAlign: 'center',
    letterSpacing: 8,
    marginTop: 8,
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
    width: 161,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#316536',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Rubik',
    textAlignVertical: 'center',
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
