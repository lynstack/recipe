import type { Theme } from "./themed-levels";
declare const level0: ((theme: Theme, props: {
    readonly size: "md";
}) => {
    readonly footer: {};
    readonly root: {
        readonly gap?: number | undefined;
    };
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly size: "md";
    }, {
        readonly footer: {};
        readonly root: {
            readonly gap?: number | undefined;
        };
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly gap: number;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("footer" | "root")[]>>;
};
declare const level1: ((theme: Theme, props: {
    readonly size: "md";
    readonly tone: "danger";
}) => {
    readonly footer: {};
    readonly icon: {
        readonly gap?: number | undefined;
    };
    readonly root: {
        readonly gap?: number | undefined;
    };
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly size: "md";
        readonly tone: "danger";
    }, {
        readonly footer: {};
        readonly icon: {
            readonly gap?: number | undefined;
        };
        readonly root: {
            readonly gap?: number | undefined;
        };
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly gap: number;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly gap: number;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("footer" | "icon" | "root")[]>>;
};
declare const level2: ((theme: Theme, props: {
    readonly size: "md";
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly footer: {};
    readonly icon: {
        readonly gap?: number | undefined;
    };
    readonly label: {
        readonly gap?: number | undefined;
    };
    readonly root: {
        readonly gap?: number | undefined;
    };
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly size: "md";
        readonly tone: "danger";
        readonly weight: "bold";
    }, {
        readonly footer: {};
        readonly icon: {
            readonly gap?: number | undefined;
        };
        readonly label: {
            readonly gap?: number | undefined;
        };
        readonly root: {
            readonly gap?: number | undefined;
        };
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly gap: number;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly gap: number;
                };
            };
        };
        readonly weight: {
            readonly bold: {
                readonly label: {
                    readonly gap: number;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("footer" | "icon" | "label" | "root")[]>>;
};
declare const level3: ((theme: Theme, props: {
    readonly shape: "round";
    readonly size: "md";
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly badge: {
        readonly gap?: number | undefined;
    };
    readonly footer: {};
    readonly icon: {
        readonly gap?: number | undefined;
    };
    readonly label: {
        readonly gap?: number | undefined;
    };
    readonly root: {
        readonly gap?: number | undefined;
    };
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly shape: "round";
        readonly size: "md";
        readonly tone: "danger";
        readonly weight: "bold";
    }, {
        readonly badge: {
            readonly gap?: number | undefined;
        };
        readonly footer: {};
        readonly icon: {
            readonly gap?: number | undefined;
        };
        readonly label: {
            readonly gap?: number | undefined;
        };
        readonly root: {
            readonly gap?: number | undefined;
        };
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly shape: {
            readonly round: {
                readonly badge: {
                    readonly gap: number;
                };
            };
        };
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly gap: number;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly gap: number;
                };
            };
        };
        readonly weight: {
            readonly bold: {
                readonly label: {
                    readonly gap: number;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("badge" | "footer" | "icon" | "label" | "root")[]>>;
};
declare const level4: ((theme: Theme, props: {
    readonly muted?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly hint: {
                readonly gap: number;
            };
        };
    }> | undefined;
    readonly shape: "round";
    readonly size: "md";
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly badge: {
        readonly gap?: number | undefined;
    };
    readonly footer: {};
    readonly hint: {
        readonly gap?: number | undefined;
    };
    readonly icon: {
        readonly gap?: number | undefined;
    };
    readonly label: {
        readonly gap?: number | undefined;
    };
    readonly root: {
        readonly gap?: number | undefined;
    };
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly muted?: import("@lynstack/native-recipe").VariantOption<{
            readonly true: {
                readonly hint: {
                    readonly gap: number;
                };
            };
        }> | undefined;
        readonly shape: "round";
        readonly size: "md";
        readonly tone: "danger";
        readonly weight: "bold";
    }, {
        readonly badge: {
            readonly gap?: number | undefined;
        };
        readonly footer: {};
        readonly hint: {
            readonly gap?: number | undefined;
        };
        readonly icon: {
            readonly gap?: number | undefined;
        };
        readonly label: {
            readonly gap?: number | undefined;
        };
        readonly root: {
            readonly gap?: number | undefined;
        };
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly muted: {
            readonly true: {
                readonly hint: {
                    readonly gap: number;
                };
            };
        };
        readonly shape: {
            readonly round: {
                readonly badge: {
                    readonly gap: number;
                };
            };
        };
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly gap: number;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly gap: number;
                };
            };
        };
        readonly weight: {
            readonly bold: {
                readonly label: {
                    readonly gap: number;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("badge" | "footer" | "hint" | "icon" | "label" | "root")[]>>;
};
export { level0, level1, level2, level3, level4 };
