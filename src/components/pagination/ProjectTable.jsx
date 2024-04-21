
// import useAPI from '../../hooks/useAPI'

// let PageSize = 10

// export default ProjectTable = ({data}) =>{
//   const [currentPage, setCurrentPage] = useState(1);
//   const [data, setData] = useState(null);

//   const { loading, error, toggleError, get } = useAPI();

//   useEffect(()=>{
//     // let projects = get()
//     const data = get(`/user/GetProjects/${currentPage}/${PageSize}`);
//     setState(data);
//   }, [currentPage, PageSize])
  

//     return (
//       <table>
//         <thead>
//           <tr>
//             <th>S/N</th>
//             <th>Project Name</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             {/* Add more table headers if needed */}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.name}</td>
//               <td>{item.email}</td>
//               {/* Add more table cells if needed */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
// }


// // export default function App() {
// //   return (
// //     <>
// //       <table>
// //         <thead>
// //           <tr>
// //             <th>ID</th>
// //             <th>FIRST NAME</th>
// //             <th>LAST NAME</th>
// //             <th>EMAIL</th>
// //             <th>PHONE</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {data.map((item) => {
// //             return (
// //               <tr>
// //                 <td>{item.id}</td>
// //                 <td>{item.first_name}</td>
// //                 <td>{item.last_name}</td>
// //                 <td>{item.email}</td>
// //                 <td>{item.phone}</td>
// //               </tr>
// //             );
// //           })}
// //         </tbody>
// //       </table>
// //     </>
// //   );
// // }