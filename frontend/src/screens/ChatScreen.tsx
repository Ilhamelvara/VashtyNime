import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';
import { Client } from '@stomp/stompjs';

// Polyfill for TextEncoder in React Native (needed for stompjs)
import 'text-encoding';

export default function ChatScreen() {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef<Client | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 1. Fetch initial chat history
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get('/chat/history');
        // Backend returns newest first. FlatList inverted={true} needs newest at the top of the array
        setMessages(response.data);
      } catch (error) {
        console.warn('Failed to fetch chat history:', error);
      }
    };
    fetchHistory();

    // 2. Connect WebSocket
    const client = new Client({
      brokerURL: 'ws://192.168.1.9:8080/ws-chat',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      onConnect: () => {
        console.log('Connected to STOMP');
        setIsConnected(true);
        client.subscribe('/topic/public', (message) => {
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [newMessage, ...prev]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log('Disconnected from STOMP');
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      },
    });

    // We must manually activate the client
    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    if (!user) return; // Must be logged in (or guest fallback)

    const chatMessage = {
      senderId: user.id || 'guest',
      senderName: user.username || 'Guest',
      senderPhoto: user.photo || '',
      content: inputText.trim(),
    };

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage),
      });
      setInputText('');
    } else {
      console.warn('WebSocket not connected. Trying simple REST fallback...');
      // Prototype fallback just to show it locally if backend isn't ready
      setMessages((prev) => [{ ...chatMessage, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === user?.id;

    return (
      <View style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperOther]}>
        {!isMe && (
          <View style={styles.avatarPlaceholder}>
            {item.senderPhoto ? (
              <Image source={{ uri: item.senderPhoto }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{(item.senderName || '?').charAt(0).toUpperCase()}</Text>
            )}
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
          <Text style={[styles.senderName, isMe && { color: 'rgba(255,255,255,0.7)' }]}>
            {isMe ? 'Kamu' : (item.senderName || 'Anonim')}
          </Text>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
        {isMe && (
          <View style={[styles.avatarPlaceholder, { marginLeft: 8, marginRight: 0 }]}>
            {item.senderPhoto ? (
              <Image source={{ uri: item.senderPhoto }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{(item.senderName || '?').charAt(0).toUpperCase()}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={24} color="#6366f1" style={{ marginRight: 8 }} />
        <Text style={styles.headerTitle}>Global Chat</Text>
        <View style={[styles.statusDot, { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }]} />
        <Text style={[styles.statusText, { color: isConnected ? '#22c55e' : '#ef4444' }]}>
          {isConnected ? 'Online' : 'Offline'}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.chatList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tulis pesan..."
          placeholderTextColor="#6b7280"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: '#111827',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chatList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageWrapperMe: {
    justifyContent: 'flex-end',
  },
  messageWrapperOther: {
    justifyContent: 'flex-start',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageBubbleMe: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: '#1f2937',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 24, // extra padding for bottom safe area
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1f2937',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
