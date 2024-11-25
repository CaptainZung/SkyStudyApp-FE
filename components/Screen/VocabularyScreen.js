import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function VocabularyScreen({ route, navigation }) {
  const { topic, words } = route.params;

  const navigateToDefinition = (word) => {
    navigation.navigate('DefinitionScreen', { word });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topic}</Text>
      <FlatList
        data={words}
        keyExtractor={(item) => item.wordId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordButton}
            onPress={() => navigateToDefinition(item)}
          >
            <Text style={styles.wordText}>{item.word}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  wordButton: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
