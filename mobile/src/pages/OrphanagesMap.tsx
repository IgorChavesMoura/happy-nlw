import React, { useState } from 'react';

import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import * as Location from 'expo-location';

import mapStyle from '../util/mapStyle';

import api from '../services/api';

import mapMarker from '../assets/images/marker.png';



export default function OrphanagesMap() {

    const navigation = useNavigation();

    const [orphanages, setOrphanages] = useState([]);
    const [location, setLocation] = useState({ latitude: -23.5806128, longitude: -46.6416567 });

    const handleNavigateToOrphanageDetails = (id: number) => {

        navigation.navigate('OrphanageDetails', { id });

    };

    const handleNavigateToCreateOrphanage = () => {

        navigation.navigate('SelectMapPosition');

    };

    useFocusEffect(() => {

        api.get('orphanages')
            .then(
                response => {

                    setOrphanages(response.data);

                }
            );

        (async () => {
            
            let { status } = await Location.requestPermissionsAsync();
            
            if (status !== 'granted') {
                alert('Não conseguimos pegar sua localização :(');
            }

            let deviceLocation = await Location.getCurrentPositionAsync({});

            let { latitude, longitude } = deviceLocation.coords;

            setLocation({ latitude, longitude });
        
        })();

    });

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008
                }}
                customMapStyle={mapStyle} >

                {
                    orphanages.map((orphanage: any) => (
                        <Marker
                            key={orphanage.id}
                            icon={mapMarker}
                            calloutAnchor={{
                                x: 2.7,
                                y: 0.8
                            }}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude
                            }}
                        >
                            <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetails(orphanage.id)} >
                                <View style={styles.calloutContainer} >
                                    <Text style={styles.calloutText} >{orphanage.name}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))
                }

            </MapView>
            <View style={styles.footer} >
                <Text style={styles.footerText} >{orphanages.length} orfanatos encontrados</Text>

                <TouchableOpacity style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage} >
                    <Feather name="plus" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    )

};

const styles = StyleSheet.create({
    container: {

        flex: 1,

    },
    map: {

        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height
        flex: 1

    },
    calloutContainer: {

        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 16,
        justifyContent: 'center'

    },
    calloutText: {

        color: "#0089a5",
        fontSize: 14,
        fontWeight: 'bold'

    },
    footer: {

        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 32,

        backgroundColor: "rgba(255,255,255,1.0)",
        borderRadius: 20,

        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,


    },
    footerText: {

        color: '#8fa7b3',
        fontFamily: 'Nunito_700Bold'

    },
    createOrphanageButton: {

        width: 56,
        height: 56,

        backgroundColor: '#15c3d6',
        borderRadius: 20,


        justifyContent: 'center',
        alignItems: 'center'



    }
});
