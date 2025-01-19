import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Message {
  user: string;
  bot: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prevMessages) => [...prevMessages, { user: userMessage, bot: '...' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.3.110:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const responseText = await response.text(); // Capture raw response
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      try {
        const data = JSON.parse(responseText); // Parse JSON
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1
              ? { ...msg, bot: data.reply || 'No response from bot.' }
              : msg
          )
        );
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1
              ? { ...msg, bot: 'Error: Invalid response format from the server.' }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? { ...msg, bot: 'Error: Unable to fetch response.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <Text style={styles.emptyMessage}>Start a conversation...</Text>
        ) : (
          messages.map((msg, index) => (
            <View key={index} style={styles.messageWrapper}>
              <Text style={styles.userMessageText}>
                <Text style={styles.boldText}>User:</Text> {msg.user}
              </Text>
              <Text style={styles.botMessageText}>
                <Text style={styles.boldText}>Maarg Darshak:</Text> {msg.bot}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? 'Sending...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 10,
    marginBottom: 80,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  messageWrapper: {
    marginBottom: 10,
  },
  userMessageText: {
    color: '#000',
    backgroundColor: '#c3e703',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  botMessageText: {
    color: '#000',
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2D2D2D',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    color: '#FFF',
    backgroundColor: '#444',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#c3e703',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  emptyMessage: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ChatPage;
