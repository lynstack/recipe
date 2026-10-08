import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
declare const button: ((props: {
    readonly className?: string | undefined;
    readonly disabled?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: "opacity-50";
    }> | undefined;
    readonly size?: import("@lynstack/class-recipe").VariantOption<{
        readonly lg: "h-12";
        readonly md: "h-10";
    }> | undefined;
    readonly tone: import("@lynstack/class-recipe").VariantOption<{
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    }>;
}) => string) & {
    readonly variantKeys: readonly ("disabled" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly lg: "h-12";
            readonly md: "h-10";
        }>[];
        readonly tone: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly danger: "bg-red-600";
            readonly neutral: "bg-gray-100";
        }>[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: import("@lynstack/class-recipe").VariantOption<{
            readonly lg: "h-12";
            readonly md: "h-10";
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly disabled: {
            readonly true: "opacity-50";
        };
        readonly size: {
            readonly lg: "h-12";
            readonly md: "h-10";
        };
        readonly tone: {
            readonly danger: "bg-red-600";
            readonly neutral: "bg-gray-100";
        };
    }, "size", string, undefined> | undefined;
};
type ButtonVariants = VariantsOf<typeof button>;
type ButtonProps = PropsOf<typeof button>;
declare const card: NoInfer<((props: {
    readonly classNames?: Readonly<Partial<Record<"root" | "title", string | undefined>>> | undefined;
    readonly size: "md";
}) => Readonly<Record<"root" | "title", string>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly "md"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: "p-4";
                readonly title: "text-base";
            };
        };
    }, never, string, readonly ("root" | "title")[]> | undefined;
}>;
declare const pill: ((props: {
    readonly className?: string | undefined;
    readonly tone: import("@lynstack/class-recipe").VariantOption<{
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    }>;
}) => string) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        }>[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly tone: {
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        };
    }, never, string, undefined> | undefined;
};
declare const field: NoInfer<((props?: {
    readonly classNames?: Readonly<Partial<Record<"input" | "label", string | undefined>>> | undefined;
    readonly invalid?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: {
            readonly input: "border-red-600";
        };
    }> | undefined;
} | undefined) => Readonly<Record<"input" | "label", string>>) & {
    readonly variantKeys: readonly "invalid"[];
    readonly variantOptions: {
        readonly invalid: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly invalid: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly invalid: {
            readonly true: {
                readonly input: "border-red-600";
            };
        };
    }, never, string, readonly ("input" | "label")[]> | undefined;
}>;
declare const merged: import("@lynstack/class-recipe").Recipes;
declare const iconButton: ((props: {
    readonly className?: string | undefined;
    readonly disabled?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: "opacity-50";
    }> | undefined;
    readonly shape: "round";
    readonly size?: import("@lynstack/class-recipe").VariantOption<{
        readonly lg: "h-12";
        readonly md: "h-10";
    }> | undefined;
    readonly tone: import("@lynstack/class-recipe").VariantOption<{
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    }>;
}) => string) & {
    readonly variantKeys: readonly ("disabled" | "shape" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly shape: readonly "round"[];
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly lg: "h-12";
            readonly md: "h-10";
        }>[];
        readonly tone: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly danger: "bg-red-600";
            readonly neutral: "bg-gray-100";
        }>[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: import("@lynstack/class-recipe").VariantOption<{
            readonly lg: "h-12";
            readonly md: "h-10";
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly disabled: {
            readonly true: "opacity-50";
        };
        readonly shape: {
            readonly round: "aspect-square";
        };
        readonly size: {
            readonly lg: "h-12";
            readonly md: "h-10";
        };
        readonly tone: {
            readonly danger: "bg-red-600";
            readonly neutral: "bg-gray-100";
        };
    }, "size", string, undefined> | undefined;
};
declare const select: NoInfer<((props?: {
    readonly classNames?: Readonly<Partial<Record<"input" | "label" | "trigger", string | undefined>>> | undefined;
    readonly invalid?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: {
            readonly input: "border-red-600";
        } | {
            readonly label: "text-red-700";
        };
    }> | undefined;
} | undefined) => Readonly<Record<"input" | "label" | "trigger", string>>) & {
    readonly variantKeys: readonly "invalid"[];
    readonly variantOptions: {
        readonly invalid: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly invalid: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly invalid: {
            readonly true: {
                readonly input: "border-red-600";
            } | {
                readonly label: "text-red-700";
            };
        };
    }, never, string, readonly ("input" | "label" | "trigger")[]> | undefined;
}>;
declare const badge: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly tone?: import("@lynstack/class-recipe").VariantOption<{
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    }> | undefined;
}>;
declare const badgeClassName: string;
declare const compactButton: ((props: {
    readonly className?: string | undefined;
    readonly disabled?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: "opacity-50";
    }> | undefined;
    readonly size?: import("@lynstack/class-recipe").VariantOption<{
        readonly lg: "h-12";
        readonly md: "h-10";
        readonly xs: "h-6";
    }> | undefined;
    readonly tone: import("@lynstack/class-recipe").VariantOption<{
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    }>;
}) => string) & {
    readonly variantKeys: readonly ("disabled" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly lg: "h-12";
            readonly md: "h-10";
            readonly xs: "h-6";
        }>[];
        readonly tone: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly danger: "bg-red-600";
            readonly neutral: "bg-gray-100";
        }>[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: import("@lynstack/class-recipe").VariantOption<{
            readonly lg: "h-12";
            readonly md: "h-10";
            readonly xs: "h-6";
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly disabled: {
            readonly true: "opacity-50";
        };
        readonly size: {
            readonly lg: "h-12";
            readonly md: "h-10";
            readonly xs: "h-6";
        };
        readonly tone: {
            readonly danger: "bg-red-600";
            readonly neutral: "bg-gray-100";
        };
    }, "size", string, undefined> | undefined;
};
declare const compactButtonClassName: string;
declare const alert: import("@lynstack/class-recipe").SlotRecipe<"root" | "title", {
    readonly classNames?: Readonly<Partial<Record<"root" | "title", string | undefined>>> | undefined;
    readonly tone: "danger";
}>;
declare const alertClassNames: Readonly<Record<"root" | "title", string>>;
declare const toggle: NoInfer<((props?: {
    readonly classNames?: Readonly<Partial<Record<"icon" | "root", string | undefined>>> | undefined;
    readonly pressed?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: {
            readonly icon: "opacity-100";
        };
    }> | undefined;
    readonly size?: import("@lynstack/class-recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }> | undefined;
} | undefined) => Readonly<Record<"icon" | "root", string>>) & {
    readonly variantKeys: readonly ("pressed" | "size")[];
    readonly variantOptions: {
        readonly pressed: readonly ("false" | "true")[];
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>[];
    };
    readonly defaultVariants: {
        readonly pressed: "false" | "true";
        readonly size: import("@lynstack/class-recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly pressed: {
            readonly true: {
                readonly icon: "opacity-100";
            };
        };
        readonly size: {
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        };
    }, "size", string, readonly ("icon" | "root")[]> | undefined;
}>;
declare const toggleClassNames: Readonly<Record<"icon" | "root", string>>;
declare const toggleRoot: string;
declare const iconClassName: string;
declare const selectClassNames: Readonly<Record<"input" | "label" | "trigger", string>>;
declare const className: string;
declare const buttonKeys: readonly ("disabled" | "size" | "tone")[];
declare const cardKeys: readonly "size"[];
declare const buttonOptions: {
    readonly size: readonly ("lg" | "md")[];
};
declare const buttonDefaults: {
    readonly disabled: "false" | "true";
};
declare const cardOptions: {
    readonly size: readonly "md"[];
};
declare const buttonProps: ButtonProps;
declare const cardProps: PropsOf<typeof card>;
declare const panel: NoInfer<((props: {
    readonly classNames?: Readonly<Partial<Record<"footer" | "root" | "title", string | undefined>>> | undefined;
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: {
            readonly root: "p-4";
            readonly title: "text-base";
        };
        readonly sm: {
            readonly footer: "gap-2";
        };
    }>;
}) => Readonly<Record<"footer" | "root" | "title", string>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: {
                readonly root: "p-4";
                readonly title: "text-base";
            };
            readonly sm: {
                readonly footer: "gap-2";
            };
        }>[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: "p-4";
                readonly title: "text-base";
            };
            readonly sm: {
                readonly footer: "gap-2";
            };
        };
    }, never, string, readonly ("footer" | "root" | "title")[]> | undefined;
}>;
declare const panelClassNames: Readonly<Record<"root" | "title" | "footer", string>>;
export { alert, alertClassNames, badge, badgeClassName, button, buttonDefaults, buttonProps, buttonKeys, buttonOptions, card, cardKeys, cardOptions, cardProps, className, compactButton, compactButtonClassName, field, iconButton, iconClassName, merged, panel, panelClassNames, pill, select, selectClassNames, toggle, toggleClassNames, toggleRoot, };
export type { ButtonProps, ButtonVariants };
