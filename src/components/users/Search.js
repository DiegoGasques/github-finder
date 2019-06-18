import React, { useState, useContext } from "react";

import githubContext from "../../context/github/githubContext";
import alertContext from "../../context/alert/alertContext";

const Search = () => {
  const [text, setText] = useState("");
  const { users, searchUsers, clearUsers } = useContext(githubContext);
  const { setAlert } = useContext(alertContext);

  const onChange = e => setText(e.target.value);

  const onSubmit = e => {
    e.preventDefault();

    if (text === "") {
      setAlert("Please enter something...", "light");
    } else {
      searchUsers(text);
      setText("");
    }
  };

  return (
    <div>
      <form className="form" onSubmit={onSubmit}>
        <input
          type="text"
          name="text"
          value={text}
          placeholder="Search users..."
          onChange={onChange}
        />
        <input
          type="submit"
          value="Search"
          name="search"
          className="btn btn-dark btn-block"
        />
      </form>
      {users.length > 0 && (
        <button className="btn btn-light btn-block" onClick={clearUsers}>
          Clear
        </button>
      )}
    </div>
  );
};

export default Search;
