import React, { useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../loading/Loading";
// import { paginationPageSize, userProfession } from "../../utils/constants";
import Pagination from "../pagination/Pagination";
import { GetDate } from "../../utils/timeUtil";
import "./OtherProActivity.css";
import {
  paginationPageSize,
  userProfession,
  activityStatus,
  constructionPhasesValue,
} from "../../utils/constants";

const OtherProActivity = ({ userInfo }) => {
  // const [projectItems, setProjectItems] = useState([]);
  const [preConstCurrentPage, setPreConstCurrentPage] = useState(1);
  const [constCurrentPage, setConstCurrentPage] = useState(1);
  const [postConstCurrentPage, setPostConstCurrentPage] = useState(1);
  // const [memberDetail, setMemberDetail] = useState(null);

  const [preConsPhaseData, setPreConsPhaseData] = useState(null);
  const [consPhaseData, setConsPhaseData] = useState(null);
  const [postConsPhaseData, setPostConsPhaseData] = useState(null);
  const [viewForm, setViewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const removeSelectedActivity = () => setSelectedActivity(null);
  const onCloseDetail = () => {
    setSelectedActivity(null);
    setViewDetail(false);
  };
  const displayActivity = (item) => {
    setSelectedActivity(item);
    setViewDetail(true);
  };

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
        // console.log(response);
      } catch (err) {
        setPreConsPhaseData(null);
      }
    };

    fetchPreConsData();
  }, [projectId, preConstCurrentPage, userInfo]);

  useEffect(() => {
    let consUrl = `https://localhost:7129/api/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=2&pageNumber=${constCurrentPage}&pageSize=${paginationPageSize}`;

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
    let postConsUrl = `https://localhost:7129/api/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=3&pageNumber=${postConstCurrentPage}&pageSize=${paginationPageSize}`;

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

  const closeForm = () => {
    setViewForm(false);
  };

  return (
    <>
      {/* <div>Project Activities</div> */}
      <button
        onClick={() => {
          setViewForm(true);
        }}
        class="nav-item right-btn"
      >
        Create Activity
      </button>
      {preConsError && (
        <div className="error-alert">
          <p>{preConsError?.message}</p>
        </div>
      )}
      {(preConsLoading || consLoading) && <Loader />}
      {/* <></> */}
      <>
        <div>
          <p>{`Project Name: ${userInfo?.projectName}` || ""}</p>
          <p>{`Name: ${userInfo?.firstName || ""}  ${userInfo?.lastName || ""}`}</p>
          <p>{`Role: ${userProfession[userInfo?.profession]}` || ""}</p>
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
                          <th>Action</th>
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
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                          <th>Action</th>
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
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actual Start Date</th>
                          <th>Actual End Date</th>
                          <th>Status</th>
                          <th>Action</th>
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
        <CreateActivityModal
          onClose={closeForm}
          projectId={userInfo.projectId}
        />
      )}

      {viewDetail && (
        <Modal
          onCloseModal={onCloseDetail}
          selectedActivity={selectedActivity}
          removeSelectedActivity={removeSelectedActivity}
        />
      )}
    </>
  );
};

const CreateActivityModal = ({ onClose, projectId }) => {
  const [activityData, setActivityData] = useState({
    // projectId: "",
    name: "",
    description: "",
    projectPhase: "",
    startDate: "",
    endDate: "",
    file: null,
  });
  const [success, setSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const { loading, error, setErrToNull, postFileReq } = useAPI();

  useEffect(() => {
    if (error || formError)
      var timeInterval = setInterval(() => {
        setFormError(null);
        setErrToNull();
      }, 2000);

    return () => clearInterval(timeInterval);
  }, [error, formError]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (file && !allowedTypes.includes(file.type)) {
        setFormError("Only word, pdf, and image files are allowed.");
        // setActivityData({ ...activityData, file: null });
        return;
      }
      setActivityData({ ...activityData, [name]: file });
    } else {
      setActivityData({ ...activityData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrToNull();
    setFormError();

    // Validate end date is not before start date
    if (new Date(activityData.endDate) < new Date(activityData.startDate)) {
      setFormError("End date cannot be before start date");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (
      activityData.file?.type &&
      !allowedTypes.includes(activityData.file?.type)
    ) {
      setFormError("Only word, pdf, and image files are allowed.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("name", activityData.name);
      formData.append("description", activityData.description);
      formData.append("projectPhase", activityData.projectPhase);
      formData.append("startDate", activityData.startDate);
      formData.append("endDate", activityData.endDate);
      formData.append("file", activityData.file);

      // https://localhost:7129/api/Activity/OtherPro/CreateActivity

      // try {}catch(error){}
      const response = await postFileReq(
        "/Activity/OtherPro/CreateActivity",
        formData
      );
      setSuccess(response?.message);

      setTimeout(() => {
        setSuccess(null);
        closeModalForm();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeModalForm = () => {
    setActivityData({
      // projectId: '',
      name: "",
      description: "",
      projectPhase: "",
      startDate: "",
      endDate: "",
      file: null,
    });

    onClose();
  };

  return (
    <>
      <div className="activity-modal-overlay">
        <div className="activity-modal-container">
          <div className="activity-modal-header">
            <h2>Create Activity</h2>
            <button onClick={closeModalForm}>Close</button>
          </div>
          {success && !loading && <p>Successfully created an activity</p>}
          {formError && (
            <div className="error-alert">
              <p>{formError}</p>
            </div>
          )}
          {error && !loading && (
            <div className="error-alert">
              <p>{error?.message}</p>
            </div>
          )}
          <div className="activity-modal-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="activity-form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={activityData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="activity-form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={activityData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="activity-form-group">
                <label htmlFor="projectPhase">Project Phase:</label>
                <select
                  id="projectPhase"
                  name="projectPhase"
                  value={activityData.projectPhase}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Project Phase</option>
                  <option value="1">Preconstruction</option>
                  <option value="2">Construction</option>
                  <option value="3">Postconstruction</option>
                </select>
              </div>
              <div className="activity-form-group">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={activityData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="activity-form-group">
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={activityData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="activity-form-group">
                <label htmlFor="file">File:</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleChange}
                  // required
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
};

const Modal = ({ onCloseModal, selectedActivity, removeSelectedActivity }) => {
  const [approvalSuccess, setApprovalSuccess] = useState(null);
  const [rejectionSuccess, setRejectionSuccess] = useState(null);
  const [editDates, setEditDates] = useState(null)
  const [editActivity, setEditActivity] = useState(null);

  const {
    projectId,
    id,
    name,
    status,
    startDate,
    endDate,
    actualStartDate,
    actualEndDate,
    description,
    phase,
    // firstName,
    // lastName,
    // profession,
    fileName,
  } = selectedActivity;

  const {
    loading: downloadLoading,
    error: downloadError,
    setErrToNull: downloadSetErrToNull,
    downloadFile: downloadGet,
  } = useAPI();

  // const {
  //   loading: approvalLoading,
  //   error: approvalError,
  //   setErrToNull: approvalSetErrToNull,
  //   patch: approvalPatch,
  // } = useAPI();

  // const {
  //   loading: rejectionLoading,
  //   error: rejectionError,
  //   setErrToNull: rejectionSetErrToNull,
  //   patch: rejectionPatch,
  // } = useAPI();

  // const ApproveActivity = () => {
  //   approvalSetErrToNull();
  //   const reqData = {
  //     activityId: activityId,
  //     projectId: projectId,
  //     statusAction: 2,
  //   };

  //   const response = approvalPatch(
  //     "https://localhost:7129/api/Activity/PM/ActivityApproval",
  //     reqData
  //   );

  //   setApprovalSuccess(response);
  //   setTimeout(() => {
  //     setApprovalSuccess(null);
  //     removeSelectedActivity(null);
  //     onClose();
  //   }, 2000);
  // };

  // const RejectActivity = () => {
  //   rejectionSetErrToNull();
  //   const reqData = {
  //     activityId: activityId,
  //     projectId: projectId,
  //     statusAction: 3,
  //   };

  //   const response = rejectionPatch(
  //     "https://localhost:7129/api/Activity/PM/ActivityApproval",
  //     reqData
  //   );

  //   setRejectionSuccess(response);
  //   setTimeout(() => {
  //     setRejectionSuccess(null);
  //     removeSelectedActivity(null);
  //     onClose();
  //   }, 2000);
  // };

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
      `/Activity/PM/DownloadActivityFile?projectId=${projectId}&ActivityId=${id}&FileName=${fileName}`,
      fileName
    );
  };

  return (
    <div className="activity-modal-overlay">
      {/* <div className="activity-modal-container" onClick={(e) => e.stopPropagation()}> */}
      <div className="activity-display-modal-container ">
        {/* {rejectionSuccess && !rejectionLoading && (
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
        )} */}
        <div className="activity-modal-header">
          <h2>Activity</h2>

          {/* <span>Activity ID: {activityId}</span> */}
          <button onClick={onCloseModal}>Close</button>
        </div>
        <div className="pm-modal-body">
          <div className="">
            <div className="div">
              <p>Name:</p>
              <p>{name}</p>
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
            {/* <div className="div">
              <p>Assigned To:</p>
              <p>{`${firstName} ${lastName}`}</p>
            </div>
            <div className="div">
              <p>Profession:</p>
              <p>{userProfession[profession]}</p>
            </div> */}
          </div>
          <div className="pm-row">
            <p>File Attached: {fileName ? `${fileName}` : "No file"} </p>
            {fileName && (
              <button onClick={downloadActivityFile}> Download File</button>
            )}
          </div>
          <div>
            {/* {status === 1 && <button onClick={ApproveActivity}>Approve</button>}
            {status === 1 && <button onClick={RejectActivity}>Reject</button>} */}
            {/* {status === 1 && <button>Reject</button>} */}
            {status === 1 && (
              <>
                {/* <button>Edit</button> */}
                {editActivity ? (
                  <button> Submit</button>
                ) : (
                  <button>Edit</button>
                )}

                {fileName ? (
                  <button>Remove File</button>
                ) : (
                  <button>Upload File</button>
                )}

                <button>Delete</button>
              </>
            )}

            {status === 2 && (
              <>
                {editDates ? (
                  <button>Save Changes</button>
                ) : (
                  <button>edit actual dates</button>
                )}

                <button>Done</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default PmActivity;

export default OtherProActivity;
