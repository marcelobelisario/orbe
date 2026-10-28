import {useEffect} from "react";
import {Image} from "expo-image";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {StyleSheet, View} from "react-native";

export default function LoadingAppState() {
    return (
        <View style={styles.screen} accessibilityLabel="Carregando seu universo financeiro">
            <StatusBar style="light"/>
            <Image source={require("@/assets/brand/opening.png")} style={styles.image} contentFit="contain"/>
        </View>
    );
}

// Permite apresentar a abertura sem depender da velocidade de carregamento das fontes.
export function AppOpeningScreen() {
    useEffect(() => {
        const timer = setTimeout(() => router.replace("/"), 6000);
        return () => clearTimeout(timer);
    }, []);
    return <LoadingAppState/>;
}

const styles = StyleSheet.create({
    screen: {flex: 1, backgroundColor: "#0c0e14"},
    image: {width: "100%", height: "100%"},
});
