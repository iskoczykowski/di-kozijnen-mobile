import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Screen = 'login' | 'orders' | 'measure';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [name, setName] = useState('Ireneusz Skoczykowski');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f7fc' }}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <View style={{ backgroundColor: '#071b34', borderRadius: 24, padding: 20, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 34, fontWeight: '900' }}>D&I</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>Kozijnen Mobile</Text>
          <Text style={{ color: '#cbd5e1', marginTop: 4 }}>Monteur-App · Bosch · Kamera · Aufmaß</Text>
        </View>

        {screen === 'login' && (
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 18 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', marginBottom: 10 }}>🔐 Login</Text>

            <Text style={{ fontWeight: '800', marginBottom: 6 }}>Monteur</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={{
                borderWidth: 1,
                borderColor: '#d7dde8',
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
              }}
            />

            <TouchableOpacity
              onPress={() => setScreen('orders')}
              style={{ backgroundColor: '#2563eb', borderRadius: 14, padding: 14 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '900' }}>
                Einloggen
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'orders' && (
          <View>
            <Text style={{ fontSize: 24, fontWeight: '900', marginBottom: 12 }}>📋 Aufträge</Text>

            {['A-2026-4323 · Neuer Kunde', 'A-2026-1090 · Aufmaß läuft'].map((order) => (
              <TouchableOpacity
                key={order}
                onPress={() => setScreen('measure')}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 18,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#dfe6f0',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '900' }}>{order}</Text>
                <Text style={{ color: '#64748b', marginTop: 4 }}>Foto · Bosch · Maße · Skizze</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {screen === 'measure' && (
          <View>
            <TouchableOpacity onPress={() => setScreen('orders')} style={{ marginBottom: 12 }}>
              <Text style={{ color: '#2563eb', fontWeight: '900' }}>← Zurück zu Aufträgen</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 24, fontWeight: '900', marginBottom: 12 }}>📐 Aufmaß</Text>

            <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '900' }}>📏 Bosch UniversalDistance 40C</Text>
              <Text style={{ color: '#64748b', marginVertical: 8 }}>
                Bluetooth-Modul wird als nächstes eingebaut.
              </Text>

              <TouchableOpacity style={{ backgroundColor: '#16a34a', borderRadius: 14, padding: 14 }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '900' }}>
                  Bosch verbinden
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '900' }}>📷 Foto</Text>
              <TouchableOpacity style={{ backgroundColor: '#2563eb', borderRadius: 14, padding: 14, marginTop: 10 }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '900' }}>
                  Foto aufnehmen
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '900' }}>📐 Maße</Text>
              <Text style={{ marginTop: 8 }}>Breite: - mm</Text>
              <Text>Höhe: - mm</Text>
              <Text>Tiefe: - mm</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
