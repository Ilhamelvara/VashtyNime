import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.navBarContainer}>
      <View style={styles.navBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          let iconOutline: any = 'home-outline';
          let iconFilled: any = 'home';
          let label = 'Beranda';

          if (route.name === 'Home') {
            iconOutline = 'home-outline';
            iconFilled = 'home';
            label = 'Beranda';
          } else if (route.name === 'Schedule') {
            iconOutline = 'calendar-outline';
            iconFilled = 'calendar';
            label = 'Jadwal';
          } else if (route.name === 'Chat') {
            iconOutline = 'chatbubbles-outline';
            iconFilled = 'chatbubbles';
            label = 'Chat';
          } else if (route.name === 'History') {
            iconOutline = 'time-outline';
            iconFilled = 'time';
            label = 'Riwayat';
          } else if (route.name === 'Profile') {
            iconOutline = 'person-outline';
            iconFilled = 'person';
            label = 'Profil';
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? iconFilled : iconOutline}
                size={22}
                color={isFocused ? '#6366f1' : '#9ca3af'}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {label}
              </Text>
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  navBarContainer: {
    height: 75,
    backgroundColor: '#0b0f19',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  navBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    width: width / 5,
    position: 'relative',
  },
  tabIcon: {
    marginBottom: 3,
  },
  tabLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#6366f1',
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
  },
});
