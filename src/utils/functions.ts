import { EBreakpoints, EDevice } from '@/common-types/ui-ux';

export const getArrayFrom0To = (numb: number): number[] => {
  return Array(numb)
    .fill('')
    .map((_, i) => i);
};

export const getDeviceType = (): EDevice => {
  const windowWidth = window.innerWidth;

  if (windowWidth > EBreakpoints.XXL) return EDevice.TV;
  if (windowWidth > EBreakpoints.XL && windowWidth <= EBreakpoints.XXL) return EDevice.LARGE_DESKTOP;
  if (windowWidth > EBreakpoints.LG && windowWidth <= EBreakpoints.XL) return EDevice.DESKTOP;
  if (windowWidth > EBreakpoints.MD && windowWidth <= EBreakpoints.LG) return EDevice.LARGE_TABLET;
  if (windowWidth > EBreakpoints.SM && windowWidth <= EBreakpoints.MD) return EDevice.TABLET;

  return EDevice.MOBILE;
};

export const beautifiedTimer = (timeNumber: number): string =>
  timeNumber < 10 ? `0${timeNumber}` : timeNumber.toString();
