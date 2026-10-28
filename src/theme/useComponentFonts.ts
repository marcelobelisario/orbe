import {Inter_400Regular} from "@expo-google-fonts/inter/400Regular";
import {Inter_500Medium} from "@expo-google-fonts/inter/500Medium";
import {Inter_600SemiBold} from "@expo-google-fonts/inter/600SemiBold";
import {Outfit_700Bold} from "@expo-google-fonts/outfit/700Bold";
import {useFonts} from "expo-font";

export function useComponentFonts() {
    return useFonts({Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Outfit_700Bold});
}
