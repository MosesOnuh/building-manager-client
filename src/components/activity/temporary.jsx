import React, { useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../loading/Loading";
import { paginationPageSize, userProfession } from "../../utils/constants";
import Pagination from "../pagination/Pagination";
import { GetDate } from "../../utils/timeUtil";

const OtherProActivity = ({ userInfo }) => {
  // const [projectItems, setProjectItems] = useState([]);
  const [preConstCurrentPage, setPreConstCurrentPage] = useState(1);
  const [constCurrentPage, setConstCurrentPage] = useState(1);
  const [postConstCurrentPage, setPostConstCurrentPage] = useState(1);
  const [memberDetail, setMemberDetail] = useState(null);

  const [preConsPhaseData, setPreConsPhaseData] = useState(null);
  const [consPhaseData, setConsPhaseData] = useState(null);
  const [postConsPhaseData, setPostConsPhaseData] = useState(null);
  const [viewForm, setViewForm] = useState(false);

  const {
    loading: preConsLoading,
    error: preConsError,
    setErrToNull: preConsSetErrToNull,
    get: preConsGet,
  } = useAPI();
  const {
    loading: consLoading,
    error: consError,
    setErrToNull: consSetErrToNull,
    get: consGet,
  } = useAPI();
  const {
    loading: postConsLoading,
    error: postConsError,
    setErrToNull: postConsSetErrToNull,
    get: postConsGet,
  } = useAPI();

  const { projectId } = useParams();

  useEffect(() => {
    let preConsUrl = `https://localhost:7129/api/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=1&pageNumber=${preConstCurrentPage}&pageSize=${paginationPageSize}`;

    const fetchPreConsData = async () => {
      try {
        const response = await preConsGet(preConsUrl);
        setPreConsPhaseData(response);
        preConsSetErrToNull();

        console.log(response);
      } catch (err) {
        setPreConsPhaseData(null);
      }
    };

    fetchPreConsData();
  }, [projectId, preConstCurrentPage, memberDetail]);

  useEffect(() => {
    let consUrl = `https://localhost:7129/api/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=2&pageNumber=${constCurrentPage}&pageSize=${paginationPageSize}`;

    const fetchConsData = async () => {
      try {
        const response = await consGet(consUrl);
        setConsPhaseData(response);
        consSetErrToNull();
        console.log(response);
      } catch (err) {
        setConsPhaseData(null);
      }
    };

    fetchConsData();
  }, [projectId, constCurrentPage, memberDetail]);

  useEffect(() => {
    let postConsUrl = `https://localhost:7129/api/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=3&pageNumber=${postConstCurrentPage}&pageSize=${paginationPageSize}`;

    const fetchPostConsData = async () => {
      try {
        const response = await postConsGet(postConsUrl);
        setPostConsPhaseData(response);
        postConsSetErrToNull();
        console.log(response);
      } catch (err) {
        setPostConsPhaseData(null);
      }
    };

    fetchPostConsData();
  }, [projectId, postConstCurrentPage, memberDetail]);

//   const viewCreateActivityForm = () => {};

  return (
    <>
      <div>otherProActivity</div>
      <button onClick={()=>{setViewForm(true)}}>Create Activity</button>
      {preConsError && (
        <div className="error-alert">
          <p>{preConsError?.message}</p>
        </div>
      )}
      {(preConsLoading || consLoading) && <Loader />}
      <>
        <div>
          <p>{userInfo?.projectName || ""}</p>
          <p>{`${userInfo?.firstName || ""}  ${userInfo?.lastName || ""}`}</p>
          <p>{userProfession[userInfo?.profession] || ""}</p>
        </div>
        <div className="activity-tables">
          <div className="phase-wrapper">
            <p> Pre Construction</p>
            {preConsPhaseData && !preConsLoading && (
              <div className="Other-Pro-tables">
                <div className="Otherpro-PreConstruction-table">
                  <>
                    <table className="table-green">
                      <thead>
                        <tr>
                          {/* <th>S/N</th> */}
                          <th>Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                          {/* Add more table headers if needed */}
                        </tr>
                      </thead>
                      <tbody>
                        {/* {!error && data?.data.map((item) => ( */}
                        {preConsPhaseData?.data?.map((item) => (
                          <tr
                            key={item.id}
                            // onClick={() => NavigateToActivity(item.id)}
                          >
                            <td>{item.name}</td>
                            <td>{GetDate(item.startDate)}</td>
                            <td>{GetDate(item.endDate)}</td>
                            <td>
                              {item.actualStartDate
                                ? GetDate(item.actualStartDate)
                                : "No date"}
                            </td>
                            <td>
                              {item.actualEndDate
                                ? GetDate(item.actualEndDate)
                                : "No date"}
                            </td>
                            <td>
                              {item.status === 1
                                ? "Pending"
                                : item.status === 2
                                ? "Approved"
                                : "Rejected"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      className="pagination-bar"
                      currentPage={preConstCurrentPage}
                      totalCount={preConsPhaseData?.pagination?.totalCount}
                      // totalCount={10}
                      pageSize={paginationPageSize}
                      onPageChange={(page) => setPreConstCurrentPage(page)}
                    />
                  </>
                </div>
                <div className="Otherpro-Construction-table"></div>
                <div className="Otherpro-PostConstruction-table"></div>
              </div>
            )}
          </div>
          <div className="phase-wrapper">
            <p>Construction phase</p>
            {consPhaseData && !consLoading && !consError && (
              <div className="Other-Pro-tables">
                <div className="Otherpro-PreConstruction-table">
                  <>
                    <table className="table-green">
                      <thead>
                        <tr>
                          {/* <th>S/N</th> */}
                          <th>Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                          {/* Add more table headers if needed */}
                        </tr>
                      </thead>
                      <tbody>
                        {/* {!error && data?.data.map((item) => ( */}
                        {consPhaseData?.data?.map((item) => (
                          <tr
                            key={item.id}
                            // onClick={() => NavigateToActivity(item.id)}
                          >
                            <td>{item.name}</td>
                            <td>{GetDate(item.startDate)}</td>
                            <td>{GetDate(item.endDate)}</td>
                            <td>
                              {item.actualStartDate
                                ? GetDate(item.actualStartDate)
                                : "No date"}
                            </td>
                            <td>
                              {item.actualEndDate
                                ? GetDate(item.actualEndDate)
                                : "No date"}
                            </td>
                            <td>
                              {item.status === 1
                                ? "Pending"
                                : item.status === 2
                                ? "Approved"
                                : "Rejected"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      className="pagination-bar"
                      currentPage={constCurrentPage}
                      totalCount={consPhaseData?.pagination?.totalCount}
                      // totalCount={10}
                      pageSize={paginationPageSize}
                      onPageChange={(page) => setConstCurrentPage(page)}
                    />
                  </>
                </div>
                <div className="Otherpro-Construction-table"></div>
                <div className="Otherpro-PostConstruction-table"></div>
              </div>
            )}
          </div>
          <div className="phase-wrapper">
            <p>Post Construction phase</p>
            {postConsPhaseData && !postConsLoading && !postConsError && (
              <div className="Other-Pro-tables">
                <div className="Otherpro-PreConstruction-table">
                  <>
                    <table className="table-green">
                      <thead>
                        <tr>
                          {/* <th>S/N</th> */}
                          <th>Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {postConsPhaseData?.data?.map((item) => (
                          <tr
                            key={item.id}
                            // onClick={() => NavigateToActivity(item.id)}
                          >
                            <td>{item.name}</td>
                            <td>{GetDate(item.startDate)}</td>
                            <td>{GetDate(item.endDate)}</td>
                            <td>
                              {item.actualStartDate
                                ? GetDate(item.actualStartDate)
                                : "No date"}
                            </td>
                            <td>
                              {item.actualEndDate
                                ? GetDate(item.actualEndDate)
                                : "No date"}
                            </td>
                            <td>
                              {item.status === 1
                                ? "Pending"
                                : item.status === 2
                                ? "Approved"
                                : "Rejected"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      className="pagination-bar"
                      currentPage={postConstCurrentPage}
                      totalCount={postConsPhaseData?.pagination?.totalCount}
                      // totalCount={10}
                      pageSize={paginationPageSize}
                      onPageChange={(page) => setPostConstCurrentPage(page)}
                    />
                  </>
                </div>
                <div className="Otherpro-Construction-table"></div>
                <div className="Otherpro-PostConstruction-table"></div>
              </div>
            )}
          </div>
        </div>

        {/* <p>{memberLoading}</p> */}
      </>
    </>
  );
};

export default OtherProActivity;
