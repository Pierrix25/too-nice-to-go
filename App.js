// App.js — Too Nice To Go (Expo) — Full updated with Details screen
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// ----------------------
// Mock data (simulated bouquets)
// ----------------------
const MOCK_BOUQUETS = [
  {
    id: "b1",
    name: "Roses blanches - Mariage",
    place: "La Maison Blanche (Paris)",
    latitude: 48.8584,
    longitude: 2.2945,
    time: "Aujourd'hui, 18:00",
    price: 0,
    freshness: "1 jour",
    description:
      "Bouquet de 25 roses blanches utilisé pour un mariage. Encore très frais — à récupérer avant 20h.",
    image: null, // placeholder (we render a color box)
  },
  {
    id: "b2",
    name: "Compo colorée - Restaurant",
    place: "Le Coin Fleuri (Lyon)",
    latitude: 45.7640,
    longitude: 4.8357,
    time: "Aujourd'hui, 20:00",
    price: 3,
    freshness: "2 jours",
    description:
      "Composition florale ayant servi comme centre de table — parfait pour décoration intérieure.",
    image: null,
  },
  {
    id: "b3",
    name: "Pivoines - Hôtel",
    place: "Hôtel Magnolia (Nice)",
    latitude: 43.7102,
    longitude: 7.2620,
    time: "Demain matin, 10:00",
    price: 0,
    freshness: "2 jours",
    description:
      "Bouquet utilisé dans le lobby, disponible pour retrait demain matin. Idéal pour atelier floral.",
    image: null,
  },
];

// ----------------------
// Home Stack (Home + Details)
// ----------------------
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={BouquetDetailsScreen} />
    </HomeStack.Navigator>
  );
}

// ----------------------
// Screens
// ----------------------

function HomeScreen({ navigation }) {
  const [bouquets, setBouquets] = useState(MOCK_BOUQUETS);
  const [region, setRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission refusée",
            "Autorisation de localisation refusée — la carte sera centrée sur Paris."
          );
          // fallback region (Paris)
          setRegion({
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          });
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
      } catch (e) {
        console.warn("Location error", e);
        setRegion({
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  if (loadingLocation && !region) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Chargement de la carte…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={region} showsUserLocation>
          {bouquets.map((b) => (
            <Marker
              key={b.id}
              coordinate={{ latitude: b.latitude, longitude: b.longitude }}
              title={b.name}
              description={b.place}
              pinColor="#0f766e"
              onPress={() => {
                // navigate to details (HomeStack => Details)
                navigation.navigate("Details", { bouquet: b });
              }}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.heading}>Bouquets disponibles près de toi</Text>
        <Text style={styles.subheading}>
          {bouquets.length} annonces · Mise à jour en temps réel (mock)
        </Text>
      </View>

      <FlatList
        data={bouquets}
        keyExtractor={(i) => i.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listCard}
            onPress={() => navigation.navigate("Details", { bouquet: item })}
          >
            <View style={styles.thumbPlaceholder}>
              <Text style={{ fontSize: 24 }}>🌸</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.place}</Text>
              <Text style={styles.cardSmall}>
                {item.time} • {item.freshness} • {item.price === 0 ? "Gratuit" : `${item.price} €`}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function BouquetDetailsScreen({ route, navigation }) {
  const { bouquet } = route.params || {};
  if (!bouquet) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Aucun bouquet sélectionné.</Text>
      </SafeAreaView>
    );
  }

  const onReserve = () => {
    Alert.alert("Réservation confirmée 🌸", `Tu as réservé "${bouquet.name}".`, [
      { text: "OK", onPress: () => navigation.popToTop() },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.detailsImageWrap}>
        {/* Image placeholder */}
        <View style={styles.detailsImage}>
          <Text style={{ fontSize: 48 }}>🌷</Text>
        </View>
        <View style={styles.detailsImageGradient} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailsTitle}>{bouquet.name}</Text>
            <Text style={styles.detailsPlace}>{bouquet.place}</Text>
          </View>
          <View style={{ marginLeft: 12, alignItems: "flex-end" }}>
            <Text style={styles.priceText}>{bouquet.price === 0 ? "Gratuit" : `${bouquet.price} €`}</Text>
            <Text style={styles.smallMuted}>{bouquet.freshness}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#0f766e" />
          <Text style={styles.infoText}>{bouquet.time}</Text>
          <Ionicons name="location-outline" size={18} color="#0f766e" style={{ marginLeft: 12 }} />
          <Text style={styles.infoText}>Voir sur la carte</Text>
        </View>

        <Text style={styles.description}>{bouquet.description}</Text>

        <TouchableOpacity style={styles.reserveButton} onPress={onReserve}>
          <Text style={styles.reserveButtonText}>Réserver ce bouquet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AddScreen() {
  const onPublish = () => {
    Alert.alert("Publié", "Ton bouquet a été publié (mock).");
  };

  return (
    <SafeAreaView style={styles.screenCentered}>
      <Text style={styles.titleLarge}>➕ Ajouter un bouquet</Text>
      <Text style={{ color: "#666", marginTop: 8, textAlign: "center" }}>
        Formulaire de publication — version mock pour le MVP.
      </Text>

      <TouchableOpacity style={[styles.reserveButton, { marginTop: 24 }]} onPress={onPublish}>
        <Text style={styles.reserveButtonText}>Publier (mock)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screenCentered}>
      <Text style={styles.titleLarge}>👤 Mon profil</Text>
      <View style={{ marginTop: 18, width: "100%", maxWidth: 420 }}>
        <View style={styles.profileCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={styles.avatarBig}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>Marie</Text>
              <Text style={{ color: "#666" }}>Sauveur de fleurs</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 14, gap: 10 }}>
            <View style={styles.statBox}>
              <Text style={{ color: "#666", fontSize: 12 }}>Fleurs sauvées</Text>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>12</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={{ color: "#666", fontSize: 12 }}>Dons</Text>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>3</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ----------------------
// Tab Navigation (Bottom)
// ----------------------
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#eee", height: Platform.OS === "android" ? 60 : 80 },
          tabBarActiveTintColor: "#0f766e",
          tabBarInactiveTintColor: "#6b7280",
          tabBarIcon: ({ color, size }) => {
            // simple icon mapping
            return <Ionicons name={route.name === "Accueil" ? "map" : route.name === "Ajouter" ? "add-circle" : "person"} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeStackScreen} />
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
  screen: { flex: 1, backgroundColor: "#f8fafb" },
  screenCentered: { flex: 1, backgroundColor: "#f8fafb", alignItems: "center", justifyContent: "center", padding: 20 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  mapContainer: { height: 300, backgroundColor: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: "hidden" },
  map: { flex: 1 },
  listHeader: { padding: 14, paddingTop: 12, backgroundColor: "transparent" },
  heading: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  subheading: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  list: { paddingHorizontal: 14, marginTop: 6 },
  listCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 10, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  thumbPlaceholder: { width: 64, height: 64, borderRadius: 10, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  cardMeta: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  cardSmall: { fontSize: 12, color: "#9ca3af", marginTop: 6 },
  detailsImageWrap: { height: 220, backgroundColor: "#f1f5f9", position: "relative" },
  detailsImage: { flex: 1, alignItems: "center", justifyContent: "center" },
  detailsImageGradient: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80, backgroundColor: "rgba(255,255,255,0.75)" },
  backButton: { position: "absolute", top: 18, left: 12, backgroundColor: "#fff", padding: 8, borderRadius: 10 },
  detailsCard: { padding: 16, backgroundColor: "#fff", marginTop: -32, marginHorizontal: 14, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  detailsTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  detailsPlace: { color: "#6b7280", marginTop: 4 },
  priceText: { fontWeight: "800", color: "#0f766e", fontSize: 16 },
  smallMuted: { fontSize: 12, color: "#9ca3af" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 8 },
  infoText: { marginLeft: 6, color: "#0f766e", fontWeight: "600", marginRight: 12 },
  description: { marginTop: 12, color: "#374151", lineHeight: 20 },
  reserveButton: { marginTop: 18, backgroundColor: "#0f766e", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  reserveButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  titleLarge: { fontSize: 20, fontWeight: "800" },
  profileCard: { backgroundColor: "#fff", padding: 14, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  avatarBig: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center" },
  statBox: { flex: 1, backgroundColor: "#f8fafc", padding: 12, borderRadius: 10, alignItems: "center" },
});
