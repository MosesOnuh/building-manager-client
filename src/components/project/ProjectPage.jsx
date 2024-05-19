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
          {/* <table className="table-green"> */}
          <div className="tableContainer w-4/5 mx-auto">
            <table className=" w-full">
              <thead>
                <tr className="bg-blue-100">
                  <th className=" py-2 border  SN">S/N</th>
                  <th className="projectName border">Project Name</th>
                  <th className="projStartDate border">Start Date</th>
                  <th className="projEndDate border">End Date</th>
                  {/* Add more table headers if needed */}
                </tr>
              </thead>
              <tbody>
                {/* {!error && data?.data.map((item) => ( */}
                {projectItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => NavigateToActivity(item.id)}
                    className="hover:bg-gray-100 focus:bg-gray:500"
                  >
                    <td className="SN border-b border-black-900 py-2 text-center">
                      1
                    </td>
                    <td className="projectName border py-2 pl-3 pr-1 ">
                      {item.name}
                    </td>
                    <td className="projStartDate border py-2 px-1 text-center">
                      {GetDate(item.startDate)}
                    </td>
                    <td className="projEndDate border-t border-b py-2 px-1 text-center">
                      {GetDate(item.endDate)}
                    </td>
                    {/* <td></td> */}
                    {/* Add more table cells if needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
