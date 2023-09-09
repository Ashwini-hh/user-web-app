import React, { useEffect, useState } from "react";
import "./App.css";

function FetchData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items to display per page
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchThrottleTimeout, setSearchThrottleTimeout] = useState(null);

  useEffect(() => {
    // Define the API URL you want to fetch data from
    const apiUrl = "https://api.github.com/users";

    // Fetch data from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Initialize the bookmarked property for each user
        const usersWithBookmarked = data.map((user) => ({
          ...user,
          bookmarked: false,
        }));
        setData(usersWithBookmarked);
        setLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedBookmarkedUserIds =
      JSON.parse(localStorage.getItem("bookmarkedUserIds")) || [];
    // Fetch data from the API and initialize the bookmarked property
    fetch("https://api.github.com/users")
      .then((response) => response.json())
      .then((data) => {
        const usersWithBookmarked = data.map((user) => ({
          ...user,
          bookmarked: savedBookmarkedUserIds.includes(user.id),
        }));
        setData(usersWithBookmarked);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Save bookmarked user IDs to localStorage whenever data changes
  useEffect(() => {
    const bookmarkedUserIds = data
      .filter((user) => user.bookmarked)
      .map((user) => user.id);
    localStorage.setItem("bookmarkedUserIds", JSON.stringify(bookmarkedUserIds));
  }, [data]);

  useEffect(() => {
    // Throttle the search query updates to avoid frequent processing
    if (searchQuery !== debouncedSearchQuery) {
      if (searchThrottleTimeout) {
        clearTimeout(searchThrottleTimeout);
      }
      const timeout = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery);
      }, 300); // Throttle time: 300 milliseconds
      setSearchThrottleTimeout(timeout);
    }
  }, [searchQuery, debouncedSearchQuery, searchThrottleTimeout]);

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter users based on the debounced search query or show all users if no query
  const filteredUsers = debouncedSearchQuery
    ? data.filter((user) =>
        user.login.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    : data;

  // Calculate the indexes of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const toggleBookmark = (userId) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === userId ? { ...user, bookmarked: !user.bookmarked } : user
      )
    );
  };

  const BookmarkedUsers = () => {
    const bookmarkedUsers = filteredUsers.filter((user) => user.bookmarked);

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

  return (
    <div className="container">
      <h3>Fetch Data from API in React</h3>

      <div className="tabs">
        <button onClick={() => setActiveTab("all")}>All Users</button>
        <button onClick={() => setActiveTab("bookmarked")}>
          Bookmarked Users
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

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
              {Array(Math.ceil(filteredUsers.length / itemsPerPage))
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
