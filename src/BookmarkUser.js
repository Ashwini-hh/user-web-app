// const BookmarkedUsers = () => {
//     const bookmarkedUsers = data.filter((user) => user.bookmarked);
  
//     return (
//       <div className="container">
//         <h3>Bookmarked Users</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Login name</th>
//               <th>Avatar</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookmarkedUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.login}</td>
//                 <td className="avatar-container">
//                   <img
//                     src={user.avatar_url}
//                     alt={`Avatar for ${user.login}`}
//                     className="avatar-image"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  