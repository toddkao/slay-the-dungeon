import { Route, Switch } from 'react-router-dom';
import { StartMenu } from './Game/StartMenu';
import { RenderBattle } from './Game/Battle/MonsterBattle';

export function Router() {
  return (
    <Switch>
      <Route exact path="/" component={StartMenu} />
      <Route exact path="/battle/:nodeID" component={RenderBattle} />
    </Switch>
  );
}
