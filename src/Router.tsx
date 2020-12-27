import { Route, Switch } from "react-router-dom";
import { StartMenu } from "./Game/StartMenu";
import { RenderBattle } from "./Game/Battle/MonsterBattle";
import { RenderDefeatScreen } from "./Game/Battle/RenderDefeatScreen";
import { Router } from "react-router";
import { createBrowserHistory } from "history";

export const AppHistory = createBrowserHistory();

export function MyRouter() {
  return (
    <Router history={AppHistory}>
      <Switch>
        <Route exact path="/defeat" component={RenderDefeatScreen} />
        <Route exact path="/battle/:nodeID" component={RenderBattle} />
        <Route path="/" component={StartMenu} />
      </Switch>
    </Router>
  );
}
