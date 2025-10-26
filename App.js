import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// ----------------------
// Données simulées
// ----------------------
const initialBouquets = [
  { id: '1', name: 'Roses blanches - Mariage', latitude: 48.8566, longitude: 2.3522 },
  { id: '2', name: 'Mélange coloré - Restaurant', latitude: 45.764, longitude: 4.8357 },
  { id: '3', name: 'Pivoines - Hôtel', latitude: 43.7102, longitude: 7.262 },
];

// ----------------------
// Écrans
// ----------------------

function HomeScreen() {
  const [bouquets] = useState(initialBouquets);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Impossible d’accéder à la localisation.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      });
    })();
  }, []);

  if (!region) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Chargement de la carte...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
      >
        {bouquets.map((b) => (
          <Marker
            key={b.id}
            coordinate={{ latitude: b.latitude, longitude: b.longitude }}
            title={b.name}
            description="Bouquet disponible"
            pinColor="#78c2ad"
          />
        ))}
      </MapView>
    </View>
  );
}

function AddScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [freshness, setFreshness] = useState('');

  const handleAdd = () => {
    alert(`Bouquet ajouté : ${title || 'Sans nom'} (${location})`);
    setTitle('');
    setLocation('');
    setFreshness('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>➕ Ajouter un bouquet</Text>
      <TextInput style={styles.input} placeholder="Nom du bouquet" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Lieu" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Fraîcheur (ex: 1 jour)" value={freshness} onChangeText={setFreshness} />
      <Button title="Publier" onPress={handleAdd} />
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👤 Mon profil</Text>
      <Text style={styles.text}>Bouquets récupérés : 3</Text>
      <Text style={styles.text}>Bouquets donnés : 2</Text>
      <Text style={styles.text}>Merci d’aider à réduire le gaspillage 🌿</Text>
    </SafeAreaView>
  );
}

// ----------------------
// Navigation
// ----------------------

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Ajouter" component={AddScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ----------------------
// Styles
// ----------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 50 },
  map: { flex: 1 },
  input: { borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 8, margin: 12 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 8 },
});
