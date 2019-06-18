import React, { useReducer } from "react";
import axios from "axios";

import GithubContext from "./githubContext";
import githubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  SET_LOADING,
  GET_REPOS,
  GET_USER,
  CLEAR_USERS
} from "../types";

let githubClientID;
let githubClientSecret;

if (process.env.NODE_ENV !== "production") {
  githubClientID = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientID = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Search users
  const searchUsers = async text => {
    setLoading();

    try {
      const res = await axios.get(
        `https://api.github.com/search/users?q=${text}&client_id=${githubClientID}&client_secret=${githubClientSecret}`
      );

      dispatch({ type: SEARCH_USERS, payload: res.data.items });
    } catch (e) {
      console.log(e);
    }
  };

  // Get user
  const getUser = async userName => {
    setLoading();

    try {
      const res = await axios.get(
        `https://api.github.com/users/${userName}?client_id=${githubClientID}&client_secret=${githubClientSecret}`
      );

      dispatch({ type: GET_USER, payload: res.data });
    } catch (e) {
      console.log(e);
    }
  };

  // Get repos
  const getUserRepos = async userName => {
    setLoading();

    try {
      const res = await axios.get(
        `https://api.github.com/users/${userName}/repos?per_page=5&sort=created:asc&client_id=${githubClientID}&client_secret=${githubClientSecret}`
      );
      dispatch({ type: GET_REPOS, payload: res.data });
    } catch (e) {
      console.log(e);
    }
  };

  // Clear users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
