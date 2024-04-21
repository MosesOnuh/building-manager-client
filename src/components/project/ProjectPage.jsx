import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { useState, useEffect } from "react";
import Pagination from "../pagination/Pagination";
import "./ProjectIndex.css";
import { GetDate } from "../../utils/timeUtil";
import { useNavigate } from "react-router-dom";
import { paginationPageSize } from "../../utils/constants";

// let PageSize = 3;

const ProjectsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [projectItems, setProjectItems] = useState([]);

  const { loading, error, setErrToNull, get } = useAPI();

  const navigate = useNavigate();

  const NavigateToActivity = (projectId) => {
    navigate(`activities/${projectId}`);
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(
          `/project/user/GetProjects/${currentPage}/${paginationPageSize}`
        );
        setData(response);
        setProjectItems(response.data);
        setErrToNull();
      } catch (err) {
        // toggleError(error);
        setProjectItems([]);
        setData(null);
      }
    };

    fetchData();
  }, [currentPage]);

  return (
    <>
      {loading && <Loader />}
      {error && (
        <div className="error-alert">
          <p>{error?.message}</p>
        </div>
      )}
      {!error && !loading && projectItems.length < 1 && (
        <p>User has no projects</p>
      )}
      {!error && !loading && projectItems.length > 0 && (
        <>
          <table className="table-green">
            <thead>
              <tr>
                {/* <th>S/N</th> */}
                <th>Project Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                {/* Add more table headers if needed */}
              </tr>
            </thead>
            <tbody>
              {/* {!error && data?.data.map((item) => ( */}
              {projectItems.map((item) => (
                <tr key={item.id} onClick={() => NavigateToActivity(item.id)}>
                  <td>{item.name}</td>
                  <td>{GetDate(item.startDate)}</td>
                  <td>{GetDate(item.endDate)}</td>
                  <td></td>
                  {/* Add more table cells if needed */}
                </tr>
              ))}
            </tbody>
          </table>
          {/* <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={projectItems.length}
              // totalCount={10}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            /> */}
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={data?.pagination?.totalCount || 3}
            // totalCount={10}
            pageSize={paginationPageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  );
};

export default ProjectsPage;

// !error && !loading &&  projectItems.length > 0 &&

// export default function App() {
//   return (
//     <>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>FIRST NAME</th>
//             <th>LAST NAME</th>
//             <th>EMAIL</th>
//             <th>PHONE</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => {
//             return (
//               <tr>
//                 <td>{item.id}</td>
//                 <td>{item.first_name}</td>
//                 <td>{item.last_name}</td>
//                 <td>{item.email}</td>
//                 <td>{item.phone}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </>
//   );
// }
