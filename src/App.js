import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/about";

import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get(
        `https://api.github.com/users?client_id=${
          process.env.REACT_APP_GITHUB_CLIENT_ID
        }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      )
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, []);

  const searchUsers = async text => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.github.com/search/users?q=${text}&client_id=${
          process.env.REACT_APP_GITHUB_CLIENT_ID
        }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      console.log(res);
      setUsers(res.data.items);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async userName => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.github.com/users/${userName}?client_id=${
          process.env.REACT_APP_GITHUB_CLIENT_ID
        }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      setUser(res.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserRepos = async userName => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.github.com/users/${userName}/repos?per_page=5&sort=created:asc&client_id=${
          process.env.REACT_APP_GITHUB_CLIENT_ID
        }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      setRepos(res.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar title="Github Finder" icon="fab fa-github" />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Fragment>
                  <Search
                    searchUsers={searchUsers}
                    clearUsers={clearUsers}
                    showClear={users.length > 0}
                    setAlert={showAlert}
                  />
                  <Users users={users} loading={loading} />
                </Fragment>
              )}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/user/:login"
              render={props => (
                <User
                  {...props}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
