export enum TIMEOUT_DEBOUNCE {
  search = 200,
}

export enum EBreakpoints {
  XXL = 1400,
  XL = 1200,
  LG = 992,
  MD = 768,
  SM = 576,
  XSM = 412,
}

export enum EDevice {
  TV = 'TV',
  LARGE_DESKTOP = 'large-desktop',
  DESKTOP = 'desktop',
  LARGE_TABLET = 'large-tablet',
  TABLET = 'tablet',
  MOBILE = 'mobile',
}

export enum EColor {
  WHITE = '#ffffff',
  BLACK = '#000000',
  BLACK_ALPHA_8 = 'rgba(#000000, 0.5)',
  ATLANTIS = '#8ecb3a',
  FRUIT_SALAD = '#49934d',
  SUSHI = '#78b833',
  SCARLET = '#f23505',
  DODGER_BLUE = '#17a9ff',
  CONIFER = '#a2d149',
  CAMEO = '#d6b899',
  CASHMERE = '#e5c29f',
}

export enum EValidationMessageType {
  REQUIRED = 'is required',
  NOT_VALID = 'is invalid',
  MUST_BE_MATCHED = 'must be matched',
  AT_LEAST_ONE_ITEM = 'Should have at least one',
}
