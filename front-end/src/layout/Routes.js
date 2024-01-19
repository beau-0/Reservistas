import React from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Dashboard from "../components/Dashboard";
import NewReservations from "../components/NewReservations";
import NewTables from "../components/NewTables";
import Seat from "../components/Seat";
import Search from "../components/Search";
import Edit from "../components/Edit";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date");

  return (
    <Switch>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservations />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat  />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <Edit  />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTables date={today()} />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/tables/new"} />
      </Route>
      <Route path="/dashboard/:date?">
        <Dashboard date={dateParam || today()} />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;