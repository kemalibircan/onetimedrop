import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import FileManagerScreen from './src/screens/FileManagerScreen';
import SendScreen from './src/screens/SendScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FAQScreen from './src/screens/FAQScreen';
import { Colors } from './src/theme';
import type { SessionData } from './src/services/socketService';

export type RootStackParamList = {
  Home: undefined;
  FileManager: undefined;
  Send: { session: SessionData; serverUrl: string };
  Settings: undefined;
  FAQ: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={Colors.bg} />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.bg,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border,
              },
              headerTintColor: Colors.accent,
              headerTitleStyle: {
                fontSize: 17,
                fontWeight: '700',
                color: Colors.text,
              },
              cardStyle: { backgroundColor: Colors.bg },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FileManager"
              component={FileManagerScreen}
              options={{
                title: 'File Library',
                headerBackTitle: '',
              }}
            />
            <Stack.Screen
              name="Send"
              component={SendScreen}
              options={{
                title: 'Send Files',
                headerLeft: () => null, // Prevent back to Home during active session
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen
              name="FAQ"
              component={FAQScreen}
              options={{ title: 'FAQ' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
