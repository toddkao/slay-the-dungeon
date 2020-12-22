import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { StartMenu } from './Game/StartMenu';
import { Map } from './Game/Map';
import { MonsterBattle } from './Game/MonsterBattle';

export function Router() {
  return (
    <Switch>
      <Route exact path="/" component={StartMenu} />
      <Route exact path="/map" component={Map} />
      <Route exact path="/battle" component={MonsterBattle} />
    </Switch>
  );
}
