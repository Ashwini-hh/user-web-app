import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function FetchData() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items to display per page
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Define the API URL you want to fetch data from
    const apiUrl = "https://api.github.com/users";

    // Use Axios to make the GET request
    axios
      .get(apiUrl)
      .then((response) => {
        // Initialize the bookmarked property for each user
        const usersWithBookmarked = response.data.map((user) => ({
          ...user,
          bookmarked: false,
        }));
        setData2(usersWithBookmarked);
        setData(usersWithBookmarked);
        setLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handlePullToRefresh = () => {
    // Reload the page to simulate a refresh
    window.location.reload();
    console.log("Hello");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate the indexes of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const toggleBookmark = (userId) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === userId ? { ...user, bookmarked: !user.bookmarked } : user
      )
    );
    setData2((prevData) =>
      prevData.map((user) =>
        user.id === userId ? { ...user, bookmarked: !user.bookmarked } : user
      )
    );
  };

  const BookmarkedUsers = () => {
    const bookmarkedUsers = data.filter((user) => user.bookmarked);

    return (
      <div className="container">
        <h3>Bookmarked Users</h3>
        {bookmarkedUsers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Login name</th>
                <th>Avatar</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookmarkedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.login}</td>
                  <td className="avatar-container">
                    <img
                      src={user.avatar_url}
                      alt={`Avatar for ${user.login}`}
                      className="avatar-image"
                    />
                  </td>
                  <td>
                    <button onClick={() => toggleBookmark(user.id)}>
                      {user.bookmarked ? "Unbookmark" : "Bookmark"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          "No Result"
        )}
      </div>
    );
  };

  const handleChange = (e) => {
    // setSearchField(e.target.value);
    const filteredPersons = data2.filter((person) => {
      return person.login.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setData(filteredPersons);
  };

  return (
    <div
      className="container"
      // onPointerDown={handlePullToRefresh}
      // onTouchStart={handlePullToRefresh}
    >
      <h3>Users List</h3>

      <div className="tabs">
        <button onClick={() => setActiveTab("all")}>All Users</button>
        <button onClick={() => setActiveTab("bookmarked")}>
          Bookmarked Users
        </button>
      </div>
      <input
        className="search-container"
        type="search"
        placeholder="Search People"
        onChange={handleChange}
      />
      <div className="mt-3">
        {activeTab === "all" && (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Login name</th>
                  <th>Avatar</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.login}</td>
                      <td className="avatar-container">
                        <img
                          src={user.avatar_url}
                          alt={`Avatar for ${user.login}`}
                          className="avatar-image"
                        />
                      </td>
                      <td>
                        <button onClick={() => toggleBookmark(user.id)}>
                          {user.bookmarked ? "Unbookmark" : "Bookmark"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
            <ul className="pagination">
              {Array(Math.ceil(data.length / itemsPerPage))
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className="page-link"
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </>
        )}
        {activeTab === "bookmarked" && <BookmarkedUsers />}
      </div>
    </div>
  );
}

export default FetchData;
