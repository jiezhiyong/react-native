import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
// Note: react-native-maps may need to be installed via 'npx expo install react-native-maps'
// import MapView, { Marker, Region, MapType } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Fallback types when react-native-maps is not available
type MapType = 'standard' | 'satellite' | 'hybrid';
type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

interface MarkerData {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
}

// Shanghai landmarks
const SHANGHAI_LANDMARKS: MarkerData[] = [
  {
    id: '1',
    coordinate: { latitude: 31.2397, longitude: 121.4999 },
    title: '外滩',
    description: 'The Bund - Historic waterfront area',
  },
  {
    id: '2',
    coordinate: { latitude: 31.2304, longitude: 121.4737 },
    title: '豫园',
    description: 'Yu Garden - Traditional Chinese garden',
  },
  {
    id: '3',
    coordinate: { latitude: 31.2416, longitude: 121.5016 },
    title: '东方明珠塔',
    description: 'Oriental Pearl Tower - Iconic TV tower',
  },
];

const MAP_TYPES: { type: MapType; label: string }[] = [
  { type: 'standard', label: 'Standard' },
  { type: 'satellite', label: 'Satellite' },
  { type: 'hybrid', label: 'Hybrid' },
];

export default function MapsDemo() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [region, setRegion] = useState<Region>({
    latitude: 31.2304, // Shanghai center
    longitude: 121.4737,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [isMapAvailable, setIsMapAvailable] = useState(false);

  useEffect(() => {
    // Check if react-native-maps is available
    try {
      // This will fail if react-native-maps is not installed
      require('react-native-maps');
      setIsMapAvailable(true);
    } catch {
      setIsMapAvailable(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Update region to user's location
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    })();
  }, []);

  const handleZoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 0.5,
      longitudeDelta: region.longitudeDelta * 0.5,
    };
    setRegion(newRegion);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };
    setRegion(newRegion);
  };

  const handleGoToLocation = () => {
    if (location) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
    } else {
      Alert.alert('Location not available', 'Please ensure location permissions are granted');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Maps Demo</CardTitle>
              <CardDescription>Interactive map with current location, custom markers, and controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Status */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Location Status</Text>
                <View className="bg-muted p-3 rounded-lg">
                  {errorMsg ? (
                    <Text className="text-destructive text-sm">{errorMsg}</Text>
                  ) : location ? (
                    <Text className="text-sm">
                      Current: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                    </Text>
                  ) : (
                    <Text className="text-muted-foreground text-sm">Getting location...</Text>
                  )}
                </View>
              </View>

              {/* Map Type Controls */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Map Type</Text>
                <View className="flex-row flex-wrap gap-2">
                  {MAP_TYPES.map(({ type, label }) => (
                    <Button
                      key={type}
                      variant={mapType === type ? 'default' : 'outline'}
                      size="sm"
                      onPress={() => setMapType(type)}
                    >
                      <Text className={mapType === type ? 'text-primary-foreground' : 'text-foreground'}>{label}</Text>
                    </Button>
                  ))}
                </View>
              </View>

              {/* Map View */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Map View</Text>
                <View className="h-80 rounded-lg overflow-hidden bg-muted border border-border">
                  {isMapAvailable ? (
                    <View className="flex-1 justify-center items-center">
                      <Text className="text-muted-foreground text-sm text-center">
                        Map component would be rendered here.{'\n'}
                        react-native-maps is available but needs proper setup.
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-1 justify-center items-center p-4">
                      <Text className="text-muted-foreground text-sm text-center mb-3">📍 Maps Demo</Text>
                      <Text className="text-muted-foreground text-xs text-center mb-4">
                        To enable real maps, install react-native-maps:{'\n'}
                        npx expo install react-native-maps
                      </Text>
                      <View className="space-y-2 w-full">
                        <Text className="text-sm font-medium text-center">Current Region:</Text>
                        <Text className="text-xs text-muted-foreground text-center">
                          {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
                        </Text>
                        <Text className="text-xs text-muted-foreground text-center">
                          Zoom: {(1 / region.latitudeDelta).toFixed(0)}x
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Map Controls */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Controls</Text>
                <View className="flex-row flex-wrap gap-2">
                  <Button variant="outline" size="sm" onPress={handleZoomIn}>
                    <Text className="text-foreground">Zoom In</Text>
                  </Button>
                  <Button variant="outline" size="sm" onPress={handleZoomOut}>
                    <Text className="text-foreground">Zoom Out</Text>
                  </Button>
                  <Button variant="outline" size="sm" onPress={handleGoToLocation}>
                    <Text className="text-foreground">My Location</Text>
                  </Button>
                </View>
              </View>

              {/* Map Info */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Map Info</Text>
                <View className="bg-muted p-3 rounded-lg space-y-1">
                  <Text className="text-sm">
                    Center: {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
                  </Text>
                  <Text className="text-sm">Zoom: {(1 / region.latitudeDelta).toFixed(0)}x</Text>
                  <Text className="text-sm">Type: {mapType}</Text>
                </View>
              </View>

              {/* Landmarks List */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Shanghai Landmarks</Text>
                <View className="space-y-2">
                  {SHANGHAI_LANDMARKS.map((landmark) => (
                    <View key={landmark.id} className="bg-muted p-3 rounded-lg">
                      <Text className="font-medium text-sm">{landmark.title}</Text>
                      <Text className="text-muted-foreground text-xs">{landmark.description}</Text>
                      <Text className="text-muted-foreground text-xs">
                        {landmark.coordinate.latitude.toFixed(6)}, {landmark.coordinate.longitude.toFixed(6)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
