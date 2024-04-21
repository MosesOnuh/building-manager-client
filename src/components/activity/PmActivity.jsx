import React, { useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../loading/Loading";
import { paginationPageSize, userProfession } from "../../utils/constants";
import Pagination from "../pagination/Pagination";
import { GetDate } from "../../utils/timeUtil";
import "./OtherProActivity.css";
import "./ClientActivity.css";
import { constructionPhasesValue } from "../../utils/constants";
import { activityStatus } from "../../utils/constants";

const PmActivity = ({ userInfo }) => {
  // const [projectItems, setProjectItems] = useState([]);
  const [preConstCurrentPage, setPreConstCurrentPage] = useState(1);
  const [constCurrentPage, setConstCurrentPage] = useState(1);
  const [postConstCurrentPage, setPostConstCurrentPage] = useState(1);
  // const [memberDetail, setMemberDetail] = useState(null);

  const [preConsPhaseData, setPreConsPhaseData] = useState(null);
  const [consPhaseData, setConsPhaseData] = useState(null);
  const [postConsPhaseData, setPostConsPhaseData] = useState(null);
  const [viewForm, setViewForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

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
    let preConsUrl = `https://localhost:7129/api/Activity/PM/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=1&pageNumber=${preConstCurrentPage}&pageSize=${paginationPageSize}`;

    const fetchPreConsData = async () => {
      try {
        const response = await preConsGet(preConsUrl);
        setPreConsPhaseData(response);
        preConsSetErrToNull();
        // console.log(response);
      } catch (err) {
        setPreConsPhaseData(null);
      }
    };

    fetchPreConsData();
  }, [projectId, preConstCurrentPage, userInfo]);

  useEffect(() => {
    let consUrl = `https://localhost:7129/api/Activity/PM/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=2&pageNumber=${constCurrentPage}&pageSize=${paginationPageSize}`;

    const fetchConsData = async () => {
      try {
        const response = await consGet(consUrl);
        setConsPhaseData(response);
        consSetErrToNull();
        // console.log(response);
      } catch (err) {
        setConsPhaseData(null);
      }
    };

    fetchConsData();
  }, [projectId, constCurrentPage, userInfo]);

  useEffect(() => {
    let postConsUrl = `https://localhost:7129/api/Activity/PM/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=3&pageNumber=${postConstCurrentPage}&pageSize=${paginationPageSize}`;

    const fetchPostConsData = async () => {
      try {
        const response = await postConsGet(postConsUrl);
        setPostConsPhaseData(response);
        postConsSetErrToNull();
        // console.log(response);
      } catch (err) {
        setPostConsPhaseData(null);
      }
    };

    fetchPostConsData();
  }, [projectId, postConstCurrentPage, userInfo]);

  const displayActivity = (item) => {
    setSelectedActivity(item);
    setViewForm(true);
  };

  const closeForm = () => {
    setViewForm(false);
  };

  const removeSelectedActivity = () => setSelectedActivity(null)

  return (
    <>
      <div>Pm Activity</div>

      {preConsError && (
        <div className="error-alert">
          <p>{preConsError?.message}</p>
        </div>
      )}
      {(preConsLoading || consLoading) && <Loader />}
      {/* <></> */}
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
                          <th>Profession</th>
                          <th>Person</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                          <th>action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {!error && data?.data.map((item) => ( */}
                        {preConsPhaseData?.data?.map((item) => (
                          <tr
                            key={item.id}
                            // onClick={() => NavigateToActivity(item.id)}
                          >
                            <td>{item.activityName}</td>
                            <td>{userProfession[item?.profession]}</td>
                            <td>
                              {`${item?.firstName || ""}  ${
                                item?.lastName || ""
                              }`}
                            </td>
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
                              {/* {item.status === 1
                                ? "Pending"
                                : item.status === 2
                                ? "Approved"
                                  ? item.status === 3
                                  : "Rejected"
                                : "Done"} */}
                              {activityStatus[item?.status]}
                            </td>
                            <td onClick={() => displayActivity(item)}>
                              View Activity
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
                          <th>Profession</th>
                          <th>Person</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                          <th>action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {!error && data?.data.map((item) => ( */}
                        {consPhaseData?.data?.map((item) => (
                          <tr
                            key={item.id}
                            // onClick={() => NavigateToActivity(item.id)}
                          >
                            <td>{item.activityName}</td>
                            <td>{userProfession[item?.profession]}</td>
                            <td>
                              {`${item?.firstName || ""}  ${
                                item?.lastName || ""
                              }`}
                            </td>
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
                              {/* {item.status === 1
                                ? "Pending"
                                : item.status === 2
                                ? "Approved"
                                  ? item.status === 3
                                  : "Rejected"
                                : "Done"} */}
                              {activityStatus[item?.status]}
                            </td>
                            <td onClick={() => displayActivity(item)}>
                              View Activity
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
                          <th>Profession</th>
                          <th>Person</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                          <th>action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {postConsPhaseData?.data?.map((item) => (
                          <tr
                            key={item.id}
                            // onClick={() => NavigateToActivity(item.id)}
                          >
                            <td>{item.activityName}</td>
                            <td>{userProfession[item?.profession]}</td>
                            <td>
                              {`${item?.firstName || ""}  ${
                                item?.lastName || ""
                              }`}
                            </td>
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
                              {/* {item.status === 1
                                ? "Pending"
                                : item.status === 2
                                ? "Approved"
                                  ? item.status === 3
                                  : "Rejected"
                                : "Done"} */}
                              {activityStatus[item?.status]}
                            </td>
                            <td onClick={() => displayActivity(item)}>
                              View Activity
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

      {viewForm && (
        <Modal
          onClose={closeForm}
          selectedActivity={selectedActivity}
          removeSelectedActivity={removeSelectedActivity}
        />
      )}
    </>
  );
};

const Modal = ({ onClose, selectedActivity, removeSelectedActivity }) => {
  const [approvalSuccess, setApprovalSuccess] = useState(null);
  const [rejectionSuccess, setRejectionSuccess] = useState(null);

  const {
    projectId,
    activityId,
    activityName,
    status,
    startDate,
    endDate,
    actualStartDate,
    actualEndDate,
    description,
    phase,
    firstName,
    lastName,
    profession,
    fileName,
  } = selectedActivity;

  const {
    loading: downloadLoading,
    error: downloadError,
    setErrToNull: downloadSetErrToNull,
    downloadFile: downloadGet,
  } = useAPI();

  const {
    loading: approvalLoading,
    error: approvalError,
    setErrToNull: approvalSetErrToNull,
    patch: approvalPatch,
  } = useAPI();

  const {
    loading: rejectionLoading,
    error: rejectionError,
    setErrToNull: rejectionSetErrToNull,
    patch: rejectionPatch,
  } = useAPI();

  const ApproveActivity = () => {
    approvalSetErrToNull();
    const reqData = {
      activityId: activityId,
      projectId: projectId,
      statusAction: 2,
    };

    const response = approvalPatch(
      "https://localhost:7129/api/Activity/PM/ActivityApproval",
      reqData
    );

    setApprovalSuccess(response);
    setTimeout(() => {
      setApprovalSuccess(null);
      removeSelectedActivity(null);
      onClose();
    }, 2000);
  };

  const RejectActivity = () => {
    rejectionSetErrToNull();
    const reqData = {
      activityId: activityId,
      projectId: projectId,
      statusAction: 3,
    };

    const response = rejectionPatch(
      "https://localhost:7129/api/Activity/PM/ActivityApproval",
      reqData
    );

    setRejectionSuccess(response);
    setTimeout(() => {
      setRejectionSuccess(null);
      removeSelectedActivity(null);
      onClose();
    }, 2000);
  };

  useEffect(() => {
    if (downloadError)
      var timeInterval = setInterval(() => {
        downloadSetErrToNull();
      }, 2000);

    return () => clearInterval(timeInterval);
  }, [downloadError]);

  const downloadActivityFile = () => {
    downloadSetErrToNull();
    downloadGet(
      `/Activity/PM/DownloadActivityFile?projectId=${projectId}&ActivityId=${activityId}&FileName=${fileName}`,
      fileName
    );
  };

  return (
    <div className="activity-modal-overlay">
      {/* <div className="activity-modal-container" onClick={(e) => e.stopPropagation()}> */}
      <div className="activity-display-modal-container ">
        {rejectionSuccess && !rejectionLoading && (
          <p>Project Successfully Rejected</p>
        )}
        {rejectionError && !rejectionLoading && (
          <div className="error-alert">
            <p>{rejectionError?.message}</p>
          </div>
        )}

        {approvalSuccess && !approvalLoading && (
          <p>Project Successfully Approved</p>
        )}
        {approvalError && !approvalLoading && (
          <div className="error-alert">
            <p>{approvalError?.message}</p>
          </div>
        )}
        {downloadError && !downloadLoading && (
          <div className="error-alert">
            <p>{downloadError?.message}</p>
          </div>
        )}

        <div className="activity-modal-header">
          <h2>Activity</h2>

          {/* <span>Activity ID: {activityId}</span> */}
          <button onClick={onClose}>Close</button>
        </div>
        <div className="pm-modal-body">
          <div className="">
            <div className="div">
              <p>Name:</p>
              <p>{activityName}</p>
            </div>
            <div className="div">
              <p>Status:</p>
              <p>
                {/* {status === 1
                  ? "Pending"
                  : status === 2
                  ? "Approved"
                    ? status === 3
                    : "Rejected"
                  : "Done"} */}
                {activityStatus[status]}
              </p>
            </div>
          </div>
          <div className="">
            <div className="div">
              <p>Start Date:</p>
              <p>{GetDate(startDate)}</p>
            </div>
            <div className="div">
              <p>End Date:</p>
              <p>{GetDate(endDate)}</p>
            </div>
            {actualEndDate && (
              <div className="div">
                <p>Actual Start Date:</p>
                <p>{GetDate(actualStartDate)}</p>
              </div>
            )}
            {actualEndDate && (
              <div className="div">
                <p>Actual End Date:</p>
                <p>{GetDate(actualEndDate)}</p>
              </div>
            )}
          </div>
          <div className="">
            <p>Description:</p> {/*make this scrollable if bigger */}
            <p>{description}</p>
          </div>
          <div className="">
            <div className="div">
              <p>Project Phase:</p>
              <p>{constructionPhasesValue[phase]}</p>
            </div>
            <div className="div">
              <p>Assigned To:</p>
              <p>{`${firstName} ${lastName}`}</p>
            </div>
            <div className="div">
              <p>Profession:</p>
              <p>{userProfession[profession]}</p>
            </div>
          </div>
          <div className="pm-row">
            <p>File Attached: {fileName ? `${fileName}` : "No file"} </p>
            {fileName && (
              <button onClick={downloadActivityFile}> Download File</button>
            )}
          </div>
          <div>
            {status === 1 && <button onClick={ApproveActivity}>Approve</button>}
            {status === 1 && <button onClick={RejectActivity}>Reject</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmActivity;
