import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { AddMovies } from "./pages/AddMovies";
import { Auth } from "./pages/Auth";
import { Movies } from "./pages/Movies";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/movies" exact>
          <Movies />
        </Route>
        <Route path="/addMovies" exact>
          <AddMovies />
        </Route>
        <Redirect to="/movies" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <Auth />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
