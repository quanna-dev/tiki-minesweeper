import { TOnClick } from '@/common-types/events';

import { EButtonStyleType } from './Button.enums';

export type TButtonProps = {
  label: string;
  stypeType?: EButtonStyleType;
  onClick?: (e: TOnClick) => void;
};
