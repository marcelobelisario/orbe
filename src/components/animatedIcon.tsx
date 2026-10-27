import {useEffect} from "react";
import type {StyleProp, ViewStyle} from "react-native";
import Animated, {
    cancelAnimation,
    Easing,
    ReduceMotion,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

import Icon, {type IconProps} from "./icon";

export type AnimatedIconProps = IconProps & {
    animation?: "pulse" | "spin";
    active?: boolean;
    duration?: number;
    containerStyle?: StyleProp<ViewStyle>;
};

export default function AnimatedIcon({
                                         animation = "pulse",
                                         active = true,
                                         duration = 1200,
                                         containerStyle,
                                         ...iconProps
                                     }: AnimatedIconProps) {
    const progress = useSharedValue(0);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        cancelAnimation(progress);
        progress.set(0);

        if (active && !reducedMotion) {
            progress.set(withRepeat(withTiming(1, {
                duration: Math.max(100, duration),
                easing: animation === "spin" ? Easing.linear : Easing.inOut(Easing.quad),
                reduceMotion: ReduceMotion.System
            }), -1, animation === "pulse", undefined, ReduceMotion.System));
        }

        return () => cancelAnimation(progress);

    }, [active, animation, duration, progress, reducedMotion]);

    const animatedStyle = useAnimatedStyle(
        () => animation === "spin"
            ? {transform: [{rotate: `${progress.get() * 360}deg`}]}
            : {opacity: 1 - progress.get() * 0.36, transform: [{scale: 1 + progress.get() * 0.08}]});

    return <Animated.View
        style={[{alignSelf: "center"}, containerStyle, animatedStyle]}><Icon {...iconProps} /></Animated.View>;
}
