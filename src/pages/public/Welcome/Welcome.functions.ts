import { navigate } from '@reach/router';

import { EGameLevel } from '@/common-types/common.d';
import { Paths } from '@/pages/routers';

export const startGame = (level: EGameLevel): Promise<void> => navigate(Paths.Game(level));
