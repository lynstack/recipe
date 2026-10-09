import type { NativeStyle, SlotStyles, VariantsOf } from "native-recipe-library";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { box, chip } from "native-recipe-library";
type BoxVariants = VariantsOf<typeof box>;
type ChipVariants = VariantsOf<typeof chip>;
declare const boxVariants: BoxVariants;
declare const boxStyle: StyleProp<ViewStyle>;
declare const boxKeys: readonly ("disabled" | "size" | "tone")[];
declare const boxOptions: {
    readonly size: readonly ("lg" | "md")[];
};
declare const boxDefaults: {
    readonly size: "lg" | "md";
};
declare const labelStyle: StyleProp<TextStyle>;
declare const iconButtonStyles: SlotStyles<"icon" | "label" | "root">;
declare const chipVariants: ChipVariants;
declare const chipStyle: StyleProp<ViewStyle>;
declare const chipKeys: readonly "tone"[];
declare const cardStyles: SlotStyles<"root" | "title">;
declare const isolatedCardStyle: NativeStyle;
declare const searchStyles: SlotStyles<"icon" | "label" | "root">;
declare const badgeStyle: NativeStyle;
export { badgeStyle, boxDefaults, boxKeys, boxOptions, boxStyle, boxVariants, cardStyles, chipKeys, chipStyle, chipVariants, iconButtonStyles, isolatedCardStyle, labelStyle, searchStyles, };
export type { BoxVariants, ChipVariants };
