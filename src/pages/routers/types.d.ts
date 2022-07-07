import { RouteComponentProps } from '@reach/router';

export interface IRouteProps extends RouteComponentProps {
  component: React.FC;
}
