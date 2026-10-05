type Style = Readonly<Record<string, string | number>>;
type MutableStyle = Record<string, string | number>;

export const styleKind = {
  initial: (base?: Style): MutableStyle => ({ ...base }),
  reduce: (style: MutableStyle, value: Style): MutableStyle =>
    Object.assign(style, value),
  finish: (style: MutableStyle): Style => Object.freeze(style),
};
