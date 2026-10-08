import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
declare const pill: ((props?: {
    readonly className?: string | undefined;
    readonly size?: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "px-3";
        readonly sm: "px-2";
    }> | undefined;
} | undefined) => string) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "px-3";
            readonly sm: "px-2";
        }>[];
    };
    readonly defaultVariants: {
        readonly size: import("@lynstack/class-recipe").VariantOption<{
            readonly md: "px-3";
            readonly sm: "px-2";
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: "px-3";
            readonly sm: "px-2";
        };
    }, "size", string, undefined> | undefined;
};
declare const chip: ((props: {
    readonly className?: string | undefined;
    readonly size?: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "px-3";
        readonly sm: "px-2";
    }> | undefined;
    readonly tone: import("@lynstack/class-recipe").VariantOption<{
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    }>;
}) => string) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "px-3";
            readonly sm: "px-2";
        }>[];
        readonly tone: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        }>[];
    };
    readonly defaultVariants: {
        readonly size: import("@lynstack/class-recipe").VariantOption<{
            readonly md: "px-3";
            readonly sm: "px-2";
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: "px-3";
            readonly sm: "px-2";
        };
        readonly tone: {
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        };
    }, "size", string, undefined> | undefined;
};
declare const tag: ((props?: {
    readonly className?: string | undefined;
    readonly muted?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: "opacity-50";
    }> | undefined;
    readonly size?: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "px-3";
        readonly sm: "px-2";
    }> | undefined;
    readonly tone?: import("@lynstack/class-recipe").VariantOption<{
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    }> | undefined;
} | undefined) => string) & {
    readonly variantKeys: readonly ("muted" | "size" | "tone")[];
    readonly variantOptions: {
        readonly muted: readonly ("false" | "true")[];
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "px-3";
            readonly sm: "px-2";
        }>[];
        readonly tone: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        }>[];
    };
    readonly defaultVariants: {
        readonly muted: "false" | "true";
        readonly size: import("@lynstack/class-recipe").VariantOption<{
            readonly md: "px-3";
            readonly sm: "px-2";
        }>;
        readonly tone: import("@lynstack/class-recipe").VariantOption<{
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly muted: {
            readonly true: "opacity-50";
        };
        readonly size: {
            readonly md: "px-3";
            readonly sm: "px-2";
        };
        readonly tone: {
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        };
    }, "size" | "tone", string, undefined> | undefined;
};
declare const look: NoInfer<((props: {
    readonly classNames?: Readonly<Partial<Record<"root", string | undefined>>> | undefined;
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }>;
}) => Readonly<Record<"root", string>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        };
    }, never, string, readonly "root"[]> | undefined;
}>;
declare const field: NoInfer<((props: {
    readonly classNames?: Readonly<Partial<Record<"label" | "root", string | undefined>>> | undefined;
    readonly invalid?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: {
            readonly label: "text-red-700";
            readonly root: "border-2";
        };
    }> | undefined;
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }>;
}) => Readonly<Record<"label" | "root", string>>) & {
    readonly variantKeys: readonly ("invalid" | "size")[];
    readonly variantOptions: {
        readonly invalid: readonly ("false" | "true")[];
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
        readonly invalid: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly invalid: {
            readonly true: {
                readonly label: "text-red-700";
                readonly root: "border-2";
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
    }, never, string, readonly ("label" | "root")[]> | undefined;
}>;
declare const select: NoInfer<((props?: {
    readonly classNames?: Readonly<Partial<Record<"label" | "root" | "trigger", string | undefined>>> | undefined;
    readonly invalid?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: {
            readonly label: "text-red-700";
            readonly root: "border-2";
        };
    }> | undefined;
    readonly open?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: {
            readonly trigger: "ring";
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
} | undefined) => Readonly<Record<"label" | "root" | "trigger", string>>) & {
    readonly variantKeys: readonly ("size" | ("invalid" | "open"))[];
    readonly variantOptions: {
        readonly invalid: readonly ("false" | "true")[];
        readonly open: readonly ("false" | "true")[];
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
        readonly invalid: "false" | "true";
        readonly open: "false" | "true";
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
        readonly invalid: {
            readonly true: {
                readonly label: "text-red-700";
                readonly root: "border-2";
            };
        };
        readonly open: {
            readonly true: {
                readonly trigger: "ring";
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
    }, "size", string, readonly ("label" | "root" | "trigger")[]> | undefined;
}>;
type ChipProps = PropsOf<typeof chip>;
type TagVariants = VariantsOf<typeof tag>;
declare const chipClassName: string;
declare const tagClassName: string;
declare const fieldClassNames: Readonly<Record<"label" | "root", string>>;
declare const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>>;
declare const joined: string;
export { chip, chipClassName, field, fieldClassNames, joined, pill, look, select, selectClassNames, tag, tagClassName, };
export type { ChipProps, TagVariants };
