import {Image} from "expo-image";
import {StyleSheet, View} from "react-native";

export function OrbeLogo() {
    return (
        <View style={styles.frame} accessibilityLabel="Orbe">
            <Image source={require("@/assets/brand/orbe.png")} contentFit="cover" style={styles.image}/>
        </View>
    );
}

const styles = StyleSheet.create({
    frame: {width: 81, height: 82, borderRadius: 23, overflow: "hidden"},
    image: {position: "absolute", left: -3.54, top: -3, width: 87.08, height: 88},
});
