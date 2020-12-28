import { Route, Switch } from "react-router-dom";
import { StartMenu } from "./Game/StartMenu";
import { RenderBattle } from "./Game/Battle/MonsterBattle";
import { RenderDefeatScreen } from "./Game/Map/RenderDefeatScreen";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import { RenderRestSite } from "./Game/Map/RenderRestSite";

export const AppHistory = createBrowserHistory();

export function MyRouter() {
  return (
    <Router history={AppHistory}>
      <Switch>
        <Route exact path="/rest" component={RenderRestSite} />
        <Route exact path="/defeat" component={RenderDefeatScreen} />
        <Route exact path="/battle/:nodeID" component={RenderBattle} />
        <Route path="/" component={StartMenu} />
      </Switch>
    </Router>
  );
}
