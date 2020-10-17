import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, MapEvent, LatLng } from 'react-native-maps';

import mapStyle from '../../util/mapStyle';

import mapMarkerImg from '../../assets/images/marker.png';
import handImg from '../../assets/images/hand.png';

export default function SelectMapPosition() {

    const navigation = useNavigation();

    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    const [showInstruction, setShowInstruction] = useState(true);

    const handleNextStep = () => {
        navigation.navigate('OrphanageData', { position });
    }

    const handleSelectMapPosition = (event: MapEvent) => {

        setPosition(event.nativeEvent.coordinate);

    };

    return (
        <View style={styles.container}>
            {
                showInstruction && (
                    <TouchableOpacity onPress={() => setShowInstruction(false)} style={styles.instructionContainer} >
                        <LinearGradient style={styles.instruction} colors={["#15B6D6", "#15D6D6"]} >
                            <Image style={styles.instructionHand} source={handImg} />
                            <Text style={styles.instructionText} >Toque no mapa para adicionar um orfanato</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )
            }
            <MapView
                initialRegion={{
                    latitude: -23.5806128,
                    longitude: -46.6416567,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }}
                style={styles.mapStyle}
                customMapStyle={mapStyle}
                onPress={handleSelectMapPosition}
            >
                {
                    (position.latitude != 0 && position.longitude != 0) && (
                        <Marker
                            icon={mapMarkerImg}
                            coordinate={{ latitude: position.latitude, longitude: position.longitude }}
                        />
                    )
                }
            </MapView>

            {
                (position.latitude != 0 && position.longitude != 0) && (
                    <RectButton style={styles.nextButton} onPress={handleNextStep}>
                        <Text style={styles.nextButtonText}>Próximo</Text>
                    </RectButton>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },

    instructionContainer: {

        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.9,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 10,

    },

    instruction: {

        flex: 1,
        left: 0,
        top: 0,
        opacity: 0.9,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

        justifyContent: 'center',
        alignItems: 'center'

    },

    instructionHand: {

        height: 105

    },

    instructionText: {

        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 24,
        lineHeight: 34,
        width: 203,
        textAlign: 'center'

    },

    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    nextButton: {
        backgroundColor: '#15c3d6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,

        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,
    },

    nextButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
    }
})