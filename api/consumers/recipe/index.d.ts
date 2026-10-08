import type { ComposableKindRecipe, ComposableKindSlotRecipe, ComposedVariants, CreateKindRecipe, CreateKindSlotRecipe, KindRecipe, NoUnknownSlots, VariantKey, VariantsOf } from "@lynstack/recipe";
type Style = Readonly<Record<string, string | number>>;
declare const styleRecipe: CreateKindRecipe<Style, Style>;
declare const text: ((props?: {
    readonly size?: import("@lynstack/recipe").VariantOption<{
        readonly lg: {
            readonly fontSize: 24;
        };
        readonly sm: {
            readonly fontSize: 12;
        };
    }> | undefined;
} | undefined) => Readonly<Record<string, string | number>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly size: import("@lynstack/recipe").VariantOption<{
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly size: {
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
        };
    }, "size", Readonly<Record<string, string | number>>, undefined> | undefined;
};
declare const slotStyleRecipe: CreateKindSlotRecipe<Style, Style>;
declare const card: ((props?: {
    readonly tone?: import("@lynstack/recipe").VariantOption<{
        readonly dark: {
            readonly root: {
                readonly backgroundColor: "black";
            };
            readonly title: {
                readonly color: "white";
            };
        };
        readonly light: {
            readonly root: {
                readonly backgroundColor: "white";
            };
        };
    }> | undefined;
} | undefined) => Readonly<Record<"root" | "title", Readonly<Record<string, string | number>>>>) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly tone: import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly tone: {
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        };
    }, "tone", Readonly<Record<string, string | number>>, readonly ("root" | "title")[]> | undefined;
};
declare const cardStyles: Readonly<Record<"root" | "title", Style>>;
declare const cardKeys: readonly "tone"[];
declare const style: Style;
declare const textKeys: readonly "size"[];
declare const textOptions: {
    readonly size: readonly ("sm" | "lg")[];
};
declare const textDefaults: {
    readonly size: "sm" | "lg";
};
declare const recipe: KindRecipe<{
    readonly size?: "sm" | "lg";
}, Style>;
declare const variants: VariantsOf<typeof text>;
declare const textKey: VariantKey<VariantsOf<typeof text>>;
declare const emphasis: ((props?: {
    readonly size?: import("@lynstack/recipe").VariantOption<{
        readonly lg: {
            readonly fontSize: 24;
        };
        readonly sm: {
            readonly fontSize: 12;
        };
        readonly xl: {
            readonly fontSize: 32;
        };
    }> | undefined;
} | undefined) => Readonly<Record<string, string | number>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
            readonly xl: {
                readonly fontSize: 32;
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly size: import("@lynstack/recipe").VariantOption<{
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
            readonly xl: {
                readonly fontSize: 32;
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly size: {
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
            readonly xl: {
                readonly fontSize: 32;
            };
        };
    }, "size", Readonly<Record<string, string | number>>, undefined> | undefined;
};
declare const emphasisStyle: Style;
declare const emphasisKeys: readonly "size"[];
declare const composable: ComposableKindRecipe<Style>;
declare const sizes: keyof ComposedVariants<readonly [typeof text], {
    readonly size: {
        readonly xl: Style;
    };
}>["size"];
declare const dialog: ((props?: {
    readonly tone?: import("@lynstack/recipe").VariantOption<{
        readonly dark: {
            readonly root: {
                readonly backgroundColor: "black";
            };
            readonly title: {
                readonly color: "white";
            };
        } | {
            readonly footer: {
                readonly borderColor: "white";
            };
        };
        readonly light: {
            readonly root: {
                readonly backgroundColor: "white";
            };
        };
    }> | undefined;
} | undefined) => Readonly<Record<"footer" | "root" | "title", Readonly<Record<string, string | number>>>>) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            } | {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly tone: import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            } | {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly tone: {
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            } | {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        };
    }, "tone", Readonly<Record<string, string | number>>, readonly ("footer" | "root" | "title")[]> | undefined;
};
declare const dialogStyles: Readonly<Record<"root" | "title" | "footer", Style>>;
declare const composableSlots: ComposableKindSlotRecipe<Style>;
declare const knownSlots: NoUnknownSlots<{
    readonly tone: {
        readonly dark: {
            readonly root: Style;
        };
    };
}, "root">;
declare const dialogOptions: {
    readonly tone: readonly ("dark" | "light")[];
};
declare const badge: KindRecipe<{
    readonly tone?: import("@lynstack/recipe").VariantOption<{
        readonly danger: {
            readonly color: "red";
        };
        readonly neutral: {
            readonly color: "gray";
        };
    }> | undefined;
}, Readonly<Record<string, string | number>>>;
declare const badgeStyle: Style;
declare const field: KindRecipe<{
    readonly invalid?: import("@lynstack/recipe").VariantOption<{
        readonly true: {
            readonly input: {
                readonly borderColor: "red";
            };
        };
    }> | undefined;
}, Readonly<Record<"input" | "label", Readonly<Record<string, string | number>>>>>;
declare const fieldStyles: Readonly<Record<"input" | "label", Style>>;
declare const bigText: ((props?: {
    readonly size?: import("@lynstack/recipe").VariantOption<{
        readonly lg: {
            readonly fontSize: 24;
        };
        readonly sm: {
            readonly fontSize: 12;
        };
        readonly xl: {
            readonly fontSize: 32;
        };
    }> | undefined;
} | undefined) => Readonly<Record<string, string | number>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
            readonly xl: {
                readonly fontSize: 32;
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly size: import("@lynstack/recipe").VariantOption<{
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
            readonly xl: {
                readonly fontSize: 32;
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly size: {
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
            readonly xl: {
                readonly fontSize: 32;
            };
        };
    }, "size", Readonly<Record<string, string | number>>, undefined> | undefined;
};
declare const bigTextStyle: Style;
declare const sheet: ((props?: {
    readonly tone?: import("@lynstack/recipe").VariantOption<{
        readonly dark: {
            readonly root: {
                readonly backgroundColor: "black";
            };
            readonly title: {
                readonly color: "white";
            };
        } | {
            readonly footer: {
                readonly borderColor: "white";
            };
        };
        readonly light: {
            readonly root: {
                readonly backgroundColor: "white";
            };
        };
    }> | undefined;
} | undefined) => Readonly<Record<"footer" | "root" | "title", Readonly<Record<string, string | number>>>>) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            } | {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly tone: import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            } | {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly tone: {
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            } | {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        };
    }, "tone", Readonly<Record<string, string | number>>, readonly ("footer" | "root" | "title")[]> | undefined;
};
declare const sheetStyles: Readonly<Record<"root" | "title" | "footer", Style>>;
declare const footedCard: ((props?: {
    readonly dense?: import("@lynstack/recipe").VariantOption<{
        readonly true: {
            readonly footer: {
                readonly borderStyle: "dashed";
            };
        };
    }> | undefined;
    readonly tone?: import("@lynstack/recipe").VariantOption<{
        readonly dark: {
            readonly root: {
                readonly backgroundColor: "black";
            };
            readonly title: {
                readonly color: "white";
            };
        };
        readonly light: {
            readonly root: {
                readonly backgroundColor: "white";
            };
        };
    }> | undefined;
} | undefined) => Readonly<Record<"footer" | "root" | "title", Readonly<Record<string, string | number>>>>) & {
    readonly variantKeys: readonly ("dense" | "tone")[];
    readonly variantOptions: {
        readonly dense: readonly ("false" | "true")[];
        readonly tone: readonly import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly dense: "false" | "true";
        readonly tone: import("@lynstack/recipe").VariantOption<{
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly dense: {
            readonly true: {
                readonly footer: {
                    readonly borderStyle: "dashed";
                };
            };
        };
        readonly tone: {
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        };
    }, "tone", Readonly<Record<string, string | number>>, readonly ("footer" | "root" | "title")[]> | undefined;
};
declare const footedCardStyles: Readonly<Record<"root" | "title" | "footer", Style>>;
export { bigText, bigTextStyle, badge, badgeStyle, card, composable, composableSlots, dialog, dialogOptions, dialogStyles, emphasis, emphasisKeys, footedCard, footedCardStyles, emphasisStyle, field, fieldStyles, knownSlots, sizes, cardKeys, cardStyles, recipe, sheet, sheetStyles, slotStyleRecipe, style, styleRecipe, text, textDefaults, textKey, textKeys, textOptions, variants, };
