import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface NetworkDetails {
  type: NetInfoStateType;
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  details: {
    isConnectionExpensive?: boolean;
    ipAddress?: string | null;
    subnet?: string | null;
    ssid?: string | null;
    bssid?: string | null;
    strength?: number | null;
    frequency?: number | null;
    linkSpeed?: number | null;
    rxLinkSpeed?: number | null;
    txLinkSpeed?: number | null;
    cellularGeneration?: string | null;
    carrier?: string | null;
  };
}

export default function NetworkInfoDemo() {
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);
  const [networkHistory, setNetworkHistory] = useState<NetworkDetails[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state) => {
      setNetworkState(state);
      addToHistory(state);
    });

    // Setup network state listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(state);
      addToHistory(state);
    });

    setIsListening(true);

    return () => {
      unsubscribe();
      setIsListening(false);
    };
  }, []);

  const addToHistory = (state: NetInfoState) => {
    const details: NetworkDetails = {
      type: state.type,
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      details: {},
    };

    // Add type-specific details
    if (state.type === 'wifi' && state.details) {
      details.details = {
        isConnectionExpensive: state.details.isConnectionExpensive,
        ipAddress: state.details.ipAddress || null,
        subnet: state.details.subnet || null,
        ssid: state.details.ssid || null,
        bssid: state.details.bssid || null,
        strength: state.details.strength || null,
        frequency: state.details.frequency || null,
        linkSpeed: state.details.linkSpeed || null,
        rxLinkSpeed: state.details.rxLinkSpeed || null,
        txLinkSpeed: state.details.txLinkSpeed || null,
      };
    } else if (state.type === 'cellular' && state.details) {
      details.details = {
        isConnectionExpensive: state.details.isConnectionExpensive,
        cellularGeneration: state.details.cellularGeneration || null,
        carrier: state.details.carrier || null,
      };
    } else if (state.type === 'ethernet' && state.details) {
      details.details = {
        isConnectionExpensive: state.details.isConnectionExpensive,
        ipAddress: state.details.ipAddress || null,
      };
    }

    setNetworkHistory((prev) => [details, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const state = await NetInfo.fetch();
      setNetworkState(state);
      addToHistory(state);
    } catch (error) {
      console.error('Error fetching network info:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getConnectionStatusIcon = (isConnected: boolean | null, isInternetReachable: boolean | null) => {
    if (isConnected === false) return '🔴';
    if (isConnected === true && isInternetReachable === true) return '🟢';
    if (isConnected === true && isInternetReachable === false) return '🟡';
    return '⚪';
  };

  const getConnectionQuality = (type: NetInfoStateType, details: any) => {
    if (type === 'wifi' && details?.strength !== undefined) {
      const strength = details.strength;
      if (strength > -50) return { quality: 'Excellent', color: 'text-green-600' };
      if (strength > -60) return { quality: 'Good', color: 'text-primary' };
      if (strength > -70) return { quality: 'Fair', color: 'text-yellow-600' };
      return { quality: 'Poor', color: 'text-red-600' };
    }
    if (type === 'cellular') {
      return { quality: 'Cellular', color: 'text-primary' };
    }
    return { quality: 'Unknown', color: 'text-muted-foreground' };
  };

  const getNetworkTypeLabel = (type: NetInfoStateType): string => {
    const typeMap: Record<NetInfoStateType, string> = {
      none: 'No Connection',
      unknown: 'Unknown',
      cellular: 'Cellular/Mobile',
      wifi: 'Wi-Fi',
      bluetooth: 'Bluetooth',
      ethernet: 'Ethernet',
      wimax: 'WiMAX',
      vpn: 'VPN',
      other: 'Other',
    };
    return typeMap[type] || type;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Info Demo</CardTitle>
              <CardDescription>Real-time network status and connection details using NetInfo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Connection Status */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Current Connection Status</Text>
                <View className="bg-muted p-3 rounded-lg">
                  {networkState ? (
                    <View className="space-y-2">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium">Status</Text>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-lg">
                            {getConnectionStatusIcon(networkState.isConnected, networkState.isInternetReachable)}
                          </Text>
                          <Text className="text-sm">
                            {networkState.isConnected
                              ? networkState.isInternetReachable
                                ? 'Connected'
                                : 'Limited Connection'
                              : 'Disconnected'}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium">Type</Text>
                        <Text className="text-sm">{getNetworkTypeLabel(networkState.type)}</Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium">Internet Reachable</Text>
                        <Text className="text-sm">
                          {networkState.isInternetReachable === null
                            ? 'Unknown'
                            : networkState.isInternetReachable
                              ? 'Yes'
                              : 'No'}
                        </Text>
                      </View>
                      {networkState.type === 'wifi' || networkState.type === 'cellular' ? (
                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm font-medium">Quality</Text>
                          <Text
                            className={`text-sm ${getConnectionQuality(networkState.type, networkState.details).color}`}
                          >
                            {getConnectionQuality(networkState.type, networkState.details).quality}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <Text className="text-sm text-muted-foreground">Loading network info...</Text>
                  )}
                </View>
              </View>

              {/* Network Details */}
              {networkState?.details && (
                <View className="space-y-2">
                  <Text className="text-sm font-medium">Network Details</Text>
                  <View className="bg-muted p-3 rounded-lg space-y-2">
                    {networkState.type === 'wifi' && networkState.details && (
                      <>
                        {networkState.details.ssid && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">SSID:</Text>
                            <Text className="text-sm text-muted-foreground">{networkState.details.ssid}</Text>
                          </View>
                        )}
                        {networkState.details.bssid && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">BSSID:</Text>
                            <Text className="text-sm text-muted-foreground font-mono">
                              {networkState.details.bssid}
                            </Text>
                          </View>
                        )}
                        {networkState.details.ipAddress && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">IP Address:</Text>
                            <Text className="text-sm text-muted-foreground font-mono">
                              {networkState.details.ipAddress}
                            </Text>
                          </View>
                        )}
                        {networkState.details.subnet && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">Subnet:</Text>
                            <Text className="text-sm text-muted-foreground font-mono">
                              {networkState.details.subnet}
                            </Text>
                          </View>
                        )}
                        {networkState.details.strength && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">Signal Strength:</Text>
                            <Text className="text-sm text-muted-foreground">{networkState.details.strength} dBm</Text>
                          </View>
                        )}
                        {networkState.details.frequency && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">Frequency:</Text>
                            <Text className="text-sm text-muted-foreground">{networkState.details.frequency} MHz</Text>
                          </View>
                        )}
                        {networkState.details.linkSpeed && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">Link Speed:</Text>
                            <Text className="text-sm text-muted-foreground">{networkState.details.linkSpeed} Mbps</Text>
                          </View>
                        )}
                      </>
                    )}

                    {networkState.type === 'cellular' && networkState.details && (
                      <>
                        {networkState.details.cellularGeneration && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">Generation:</Text>
                            <Text className="text-sm text-muted-foreground">
                              {networkState.details.cellularGeneration}
                            </Text>
                          </View>
                        )}
                        {networkState.details.carrier && (
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium">Carrier:</Text>
                            <Text className="text-sm text-muted-foreground">{networkState.details.carrier}</Text>
                          </View>
                        )}
                      </>
                    )}

                    {networkState.details.isConnectionExpensive !== undefined && (
                      <View className="flex-row justify-between">
                        <Text className="text-sm font-medium">Expensive Connection:</Text>
                        <Text className="text-sm text-muted-foreground">
                          {networkState.details.isConnectionExpensive ? 'Yes' : 'No'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Controls */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Controls</Text>
                <View className="flex-row gap-2">
                  <Button onPress={handleRefresh} disabled={refreshing} className="flex-1">
                    <Text className="text-primary-foreground">{refreshing ? 'Refreshing...' : 'Refresh'}</Text>
                  </Button>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm">Listening:</Text>
                    <Text className={`text-sm ${isListening ? 'text-green-600' : 'text-red-600'}`}>
                      {isListening ? '🟢 ON' : '🔴 OFF'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Network History */}
              {networkHistory.length > 0 && (
                <View className="space-y-2">
                  <Text className="text-sm font-medium">Connection History</Text>
                  <View className="space-y-2 max-h-64">
                    <ScrollView nestedScrollEnabled className="space-y-2">
                      {networkHistory.map((entry, index) => (
                        <View key={index} className="bg-muted p-3 rounded-lg">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-sm font-medium">{getNetworkTypeLabel(entry.type)}</Text>
                            <Text className="text-sm text-muted-foreground">
                              {getConnectionStatusIcon(entry.isConnected, entry.isInternetReachable)}
                              {entry.isConnected
                                ? entry.isInternetReachable
                                  ? ' Connected'
                                  : ' Limited'
                                : ' Disconnected'}
                            </Text>
                          </View>
                          {entry.details.ssid && (
                            <Text className="text-xs text-muted-foreground">SSID: {entry.details.ssid}</Text>
                          )}
                          {entry.details.cellularGeneration && (
                            <Text className="text-xs text-muted-foreground">
                              {entry.details.cellularGeneration}
                              {entry.details.carrier && ` - ${entry.details.carrier}`}
                            </Text>
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}

              {/* Instructions */}
              <View className="space-y-2">
                <Text className="text-sm font-medium">Instructions</Text>
                <View className="bg-muted p-3 rounded-lg space-y-1">
                  <Text className="text-sm">• Real-time network monitoring is active</Text>
                  <Text className="text-sm">• Try switching between WiFi/cellular/airplane mode</Text>
                  <Text className="text-sm">• Pull to refresh for manual update</Text>
                  <Text className="text-sm">• Connection history shows last 10 changes</Text>
                  <Text className="text-sm text-muted-foreground">
                    Note: Some details may be limited on iOS due to privacy restrictions
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
