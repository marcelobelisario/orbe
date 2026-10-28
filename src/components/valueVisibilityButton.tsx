import {useValueVisibility} from "@/contexts/valueVisibility";
import {useTheme} from "@/theme/themeProvider";
import Btn from "./btn";
import Icon from "./icon";

export default function ValueVisibilityButton() {
    const {valuesVisible, toggleValues} = useValueVisibility();
    const {colors} = useTheme();
    return (
        <Btn
            size="icon"
            variant="secondary"
            icon={<Icon name={valuesVisible ? "eye" : "eyeOff"} color={colors.text}/>}
            onPress={toggleValues}
            accessibilityLabel={valuesVisible ? "Ocultar valores" : "Mostrar valores"}
            accessibilityState={{checked: !valuesVisible}}
            aria-pressed={!valuesVisible}
        />
    );
}
