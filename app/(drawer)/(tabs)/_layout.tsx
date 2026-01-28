import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useGlobalContext } from "@/lib/globalprovider";
import { Tabs } from 'expo-router';
import { Image, Platform } from 'react-native';
import TabBarBackground from '../../../components/ui/TabBarBackground';
import { Colors } from '../../../constants/Colors';



const MatchFeedIcon = ({ focused, color }: { focused: boolean, color: string }) => {
  if (focused) {
    return (
      <Image 
        source={require('../../../assets/images/match-feed-selected.png')}
        style={{ width: 28, height: 28 }}
        resizeMode="contain"
      />
    );
  }
  return (
    <Image 
      source={require('../../../assets/images/match-feed-unselected.png')}
      style={{ width: 28, height: 28 }}
      resizeMode="contain"
    />
  );
};

const LadderStandingIcon = ({ focused, color }: { focused: boolean, color: string }) => {
  if (focused) {
    return (
      <Image 
        source={require('../../../assets/images/LadderStandingsSelected.png')}
        style={{ width: 28, height: 28 }}
        resizeMode="contain"
      />
    );
  }
  return (
    <Image 
      source={require('../../../assets/images/LadderStandingsUnselected.png')}
      style={{ width: 28, height: 28 }}
      resizeMode="contain"
    />
  );
};

const ProfileIcon = ({ focused, color }: { focused: boolean, color: string }) => {
  if (focused) {
    return (
      <Image 
        source={require('../../../assets/images/ProfileSelected.png')}
        style={{ width: 28, height: 28 }}
        resizeMode="contain"
      />
    );
  }
  return (
    <Image 
      source={require('../../../assets/images/ProfileUnselected.png')}
      style={{ width: 28, height: 28 }}
      resizeMode="contain"
    />
  );
};

const EnterScoreIcon = ({ focused, color }: { focused: boolean, color: string }) => {
  if (focused) {
    return (
      <Image 
        source={require('../../../assets/images/EnterScoreIconSelected.png')}
        style={{ width: 28, height: 28 }}
        resizeMode="contain"
      />
    );
  }
  return (
    <Image 
      source={require('../../../assets/images/EnterScoreUnselected.png')}
      style={{ width: 28, height: 28 }}
      resizeMode="contain"
    />
  );
};

export default function TabLayout() {
  const {loading, isLoggedIn, user, refetch} = useGlobalContext();

  console.log("UserInfo in _layout.tsx.TabLayout : " , user)
  let isLeagueMember = false;
  if(user?.isLeagueMember){
    isLeagueMember = true;
  }

  console.log("isLeagueMember = ", isLeagueMember)

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          android: {
            position: 'relative',
            elevation: 8,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderTopWidth: 1,
            borderTopColor: colorScheme === 'dark' ? '#333' : '#eee',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Match Feed',
          tabBarIcon: ({ color, focused }) => <MatchFeedIcon focused={focused} color={color} />,
          headerShown: false,
          href: isLeagueMember ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="LadderStandings"
        options={{
          title: 'Ladder Standings',
          tabBarIcon: ({ color, focused }) => <LadderStandingIcon focused={focused} color={color} />,
          headerShown: false,
          href: isLeagueMember ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="EnterScore"
        options={{
          title: 'Enter Score',
          tabBarIcon: ({ color, focused }) => <EnterScoreIcon focused={focused} color={color} />,
          headerShown: false,
          href: isLeagueMember ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="NoLeague"
        options={{
          title: 'Not a League Member',
          tabBarIcon: ({ color, focused }) => <ProfileIcon focused={focused} color={color} />,
          headerShown: false,
          href: isLeagueMember ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <ProfileIcon focused={focused} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
