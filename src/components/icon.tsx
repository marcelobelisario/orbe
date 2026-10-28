import {Image} from "expo-image";
import {Text, type StyleProp, type TextStyle} from "react-native";

import {useTheme} from "@/theme/themeProvider";

const assets = {
    back: {source: require("@/assets/icons/chevron-left.svg"), size: 16},
    plus: {source: require("@/assets/icons/plus.svg"), size: 16},
    arrowRight: {source: require("@/assets/icons/arrow-right.svg"), size: 20},
    eye: {source: require("@/assets/icons/eye.svg"), size: 20},
    eyeOff: {source: require("@/assets/icons/eye-off.svg"), size: 20},
    chevronDown: {source: require("@/assets/icons/chevron-down.svg"), size: 16},
    entryBack: {source: require("@/assets/icons/entry-back.svg"), size: 16},
    entryArrow: {source: require("@/assets/icons/entry-arrow.svg"), size: 20},
    check: {source: require("@/assets/icons/check.svg"), size: 11, height: 8},
} as const;

export type IconName = keyof typeof assets;
export type IconProps = {
    color?: string;
    testID?: string;
} & (
    | { name: IconName; emoji?: never; size?: never; style?: never }
    | { name?: never; emoji: string; size?: number; style?: StyleProp<TextStyle> }
    );

/** Vector icons keep the original Figma dimensions; emoji sizes are configurable. */
export default function Icon(props: IconProps) {
    const {colors} = useTheme();
    const {testID} = props;
    if (props.name) {
        const asset = assets[props.name];
        return (
            <Image
                source={asset.source}
                style={{width: asset.size, height: "height" in asset ? asset.height : asset.size}}
                contentFit="contain"
                tintColor={
                    props.color ??
                    (props.name === "plus"
                        ? colors.onPrimary
                        : props.name === "back"
                            ? colors.text
                            : colors.muted)
                }
                testID={testID}
            />
        );
    }
    const size = props.size ?? 18;
    return (
        <Text
            testID={testID}
            style={[
                {
                    color: props.color ?? colors.text,
                    fontSize: size,
                    lineHeight: size + 10,
                    textAlign: "center",
                },
                props.style,
            ]}
        >
            {props.emoji}
        </Text>
    );
}
