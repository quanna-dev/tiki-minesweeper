import env from '@/env';
import AuthorizedInstance from '@/services/authorized-api';

const TikiMinesweeperService = AuthorizedInstance(env.api.baseUrl.tikiMinesweeperService);

export default TikiMinesweeperService;
export * from './mines-controller';
