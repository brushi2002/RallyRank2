import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import OnboardingFlow from '../../components/OnBoardingFlow';
import { styles } from '../../constants/styles';

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(true);
    //handle SignUp
    const handleSignUp = () => {
        router.push('/(auth)/sign-up');

    }
    const handleSignIn = () => {
        router.push('/(auth)/sign-in');
    }
    
    {/* Sign Up Button */}
    return (
    <View style={{ flex: 1, backgroundColor: '#316536' }}>
        <View style={{ flex: 1 }}>
            <OnboardingFlow />
        </View>
        <View style={{ paddingVertical: 20, alignItems: 'center', backgroundColor: '#316536' }}>
                    <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSignUp}
                    disabled={isLoading}
                    > 
                        <Text style={styles.submitButtonText} allowFontScaling={false}>
                        {isLoading ? 'Submitting...' : 'Sign up'}
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSignIn}
                        disabled={isLoading}
                    > 
                        <Text style={styles.submitButtonText}allowFontScaling={false}>
                            {isLoading ? 'Submitting...' : 'Sign in'}
                        </Text>
                    </TouchableOpacity>
                </View>
    </View>
    )
}

export default SignIn;