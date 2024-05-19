import React, { useEffect, useRef } from "react";
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
import OtherProTable from "../utility/table/OtherProTable";
import NonFound from "../utility/NonFound";
import GetErrorNotification from "../utility/GetErrorNotification";
import { FaRemoveFormat } from "react-icons/fa";
import {
  TextInput,
  InputField,
  TextAreaField,
  SelectInputField,
} from "../utility/InputFields";
import GeneralBtn from "../utility/buttons/MainBtns";
import FormItemDisplay, {
  FormItemDisplayBig,
} from "../utility/FormItemDisplay";
import { FaXmark } from "react-icons/fa6";
import { format } from "date-fns";
import AppModal from "../utility/Modals/Modal";
import {
  SmallDefaultBtn,
  DeleteBtn,
  DownloadBtn,
} from "../utility/buttons/SmallBtns";
import { toast } from "react-toastify";
import CausionModal from "../utility/Modals/CausionModal";

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
  const [refreshPage, SetRefreshPage] = useState(false);

  const removeSelectedActivity = () => setSelectedActivity(null);
  const onCloseDetail = (isRefresh) => {
    setSelectedActivity(null);
    setViewDetail(false);
    if (isRefresh) {
      // SetRefreshPage(true);
      SetRefreshPage(!refreshPage);
    }
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
  }, [projectId, preConstCurrentPage, userInfo, refreshPage]);

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
  }, [projectId, constCurrentPage, userInfo, refreshPage]);

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
  }, [projectId, postConstCurrentPage, userInfo, refreshPage]);

  const closeForm = () => {
    setViewForm(false);
  };

  return (
    <>
      {/* <div>Project Activities</div> */}
      {/* <button
        className={` ${
          bgColor ? "bg-black text-white" : "bg-gray-200"
        } w-fit border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base`}
      >
        {children}
      </button> */}
      <button
        onClick={() => {
          setViewForm(true);
        }}
        className="mt-3 block ml-auto border-2 border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base"
      >
        Create Activity
      </button>
      {preConsError && (
        <div className="error-alert">
          <p>{preConsError?.message}</p>
        </div>
      )}
      {(preConsLoading || consLoading) && <Loader />}
      <>
        <div className="activity-tables">
          <div className="phase-wrapper">
            {preConsPhaseData?.data?.length > 0 &&
              !preConsLoading &&
              !preConsError && (
                <>
                  <p className="my-3 font-bold text-xs md:text-sm lg:text-base">
                    Pre-Construction Phase Activities
                  </p>
                  <div
                    style={{ width: "95%" }}
                    className="tableContainer mx-auto"
                  >
                    <OtherProTable
                      items={preConsPhaseData?.data}
                      displayActivity={displayActivity}
                    />
                  </div>
                  <Pagination
                    className="pagination-bar"
                    currentPage={preConstCurrentPage}
                    totalCount={preConsPhaseData?.pagination?.totalCount}
                    // totalCount={10}
                    pageSize={paginationPageSize}
                    onPageChange={(page) => setPreConstCurrentPage(page)}
                  />
                </>
              )}
            {preConsPhaseData?.data?.length == 0 && !preConsLoading && (
              <div className="sm:my-10">
                <NonFound
                  customMessage={
                    "User has not created any Preconstruction Activity"
                  }
                />
              </div>
            )}
            {preConsError && !preConsLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  message={"Pre-Construction Phase Activities"}
                />
              </div>
              // <p>Pre- Construction Activities Error</p>
            )}
          </div>
          <div className="phase-wrapper mt-10">
            {consPhaseData?.data?.length > 0 && !consLoading && !consError && (
              <>
                <p className="font-bold text-xs md:text-sm lg:text-base my-3">
                  Construction Phase Activities
                </p>
                <div
                  style={{ width: "95%" }}
                  className="tableContainer mx-auto"
                >
                  <OtherProTable
                    items={consPhaseData?.data}
                    displayActivity={displayActivity}
                  />
                </div>
                <Pagination
                  className="pagination-bar"
                  currentPage={constCurrentPage}
                  totalCount={consPhaseData?.pagination?.totalCount}
                  // totalCount={10}
                  pageSize={paginationPageSize}
                  onPageChange={(page) => setConstCurrentPage(page)}
                />
              </>
            )}
            {consPhaseData?.data?.length == 0 && !consLoading && !consError && (
              <div className="sm:my-10">
                <NonFound
                  customMessage={
                    "User has not created any Construction Activity"
                  }
                />
              </div>
            )}
            {consError && !consLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  message={"Construction Phase Activities"}
                />
              </div>
            )}
          </div>
          <div className="phase-wrapper mt-10">
            {postConsPhaseData?.data?.length > 0 &&
              !postConsLoading &&
              !postConsError && (
                <>
                  <p className="font-bold text-xs md:text-sm lg:text-base my-3">
                    Post-Construction Phase Activities
                  </p>
                  <div
                    style={{ width: "95%" }}
                    className="tableContainer mx-auto"
                  >
                    <OtherProTable
                      items={postConsPhaseData?.data}
                      displayActivity={displayActivity}
                    />
                  </div>
                  <Pagination
                    className="pagination-bar"
                    currentPage={postConstCurrentPage}
                    totalCount={postConsPhaseData?.pagination?.totalCount}
                    // totalCount={10}
                    pageSize={paginationPageSize}
                    onPageChange={(page) => setPostConstCurrentPage(page)}
                  />
                </>
              )}
            {postConsPhaseData?.data?.length == 0 &&
              !postConsLoading &&
              !postConsError && (
                <div className="sm:my-10">
                  <NonFound
                    customMessage={
                      "User has not created any Post-Construction Activity"
                    }
                  />
                </div>
              )}
            {postConsError && !postConsLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  message={"Post-Construction Phase Activities"}
                />
              </div>
            )}
          </div>
        </div>
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
          pageRefresh={SetRefreshPage}
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

// const Modal = ({ onCloseModal, selectedActivity, removeSelectedActivity }) => {
const Modal = ({ onCloseModal, selectedActivity, pageRefresh }) => {
  // const [approvalSuccess, setApprovalSuccess] = useState(null);
  // const [rejectionSuccess, setRejectionSuccess] = useState(null);
  // const [editDates, setEditDates] = useState(null);
  const [editActivity, setEditActivity] = useState(null);
  const [editActualDates, setEditActualDates] = useState(false);
  const [formData, setFormData] = useState({
    ...selectedActivity,
    startDate: format(new Date(selectedActivity.startDate), "yyyy-MM-dd"),
    endDate: format(new Date(selectedActivity.endDate), "yyyy-MM-dd"),
    // endDate: null,
  });
  const [fileInputDisplay, setFileInputDisplay] = useState(false);
  const [activityFile, setActivityFile] = useState(null);
  const [fileChange, setFileChange] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    // onCloseModal(true);

    if (fileChange) {
      // pageRefresh(true);
      onCloseModal(true);
    } else {
      onCloseModal(false);
    }
  };

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
    projectPhase,
    fileName,
  } = formData;

  const {
    // loading: downloadLoading,
    // error: downloadError,
    setErrToNull: downloadSetErrToNull,
    downloadFile: downloadGet,
  } = useAPI();

  const {
    // loading: deleteLoading,
    // error: deleteError,
    setErrToNull: deleteSetErrToNull,
    deleteRequest: deleteFile,
  } = useAPI();

  const {
    // loading: deleteLoading,
    // error: deleteError,
    setErrToNull: addFileSetErrToNull,
    patchFileReq: addFile,
  } = useAPI();

  const toastId = useRef(null);
  const downloadActivityFile = async () => {
    downloadSetErrToNull();
    try {
      toastId.current = toast.loading("Downloading...");
      await downloadGet(
        `/Activity/OtherPro/DownloadActivityFile?projectId=${projectId}&ActivityId=${id}&FileName=${fileName}`,
        fileName
      );
      toast.update(toastId.current, {
        render: "Download Successful",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    } catch (error) {
      toast.update(toastId.current, {
        render: error?.message || "Error Downloading File",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 3000);
    }
  };

  const deleteActivityFile = async () => {
    deleteSetErrToNull();
    try {
      toastId.current = toast.loading("Deleting File...");
      await deleteFile(
        `/Activity/OtherPro/DeletePendingActivityFile?projectId=${projectId}&ActivityId=${id}&FileName=${fileName}`
      );
      setFileChange(true);
      setFormData({ ...formData, fileName: null });
      toast.update(toastId.current, {
        render: "File Deleted Successfully",
        type: "success",
        isLoading: false,
      });
      setDeleteModal(false);
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    } catch (error) {
      toast.update(toastId.current, {
        render: error?.message || "Error Deleting File",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 3000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // this.setStatee({file});
    setActivityFile(file);
  };

  const addActivityFile = async () => {
    addFileSetErrToNull();
    try {
      const fileData = new FormData();
      fileData.append("projectId", projectId);
      fileData.append("activityId", id);
      fileData.append("file", activityFile);

      toastId.current = toast.loading("Adding File...");
      await addFile("/Activity/OtherPro/AddActivityFile", fileData);
      setFileChange(true);
      setFormData({ ...formData, fileName: activityFile.name });
      setFileInputDisplay(false);

      toast.update(toastId.current, {
        render: "File Added Successfully",
        type: "success",
        isLoading: false,
      });
      setDeleteModal(false);
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    } catch (error) {
      toast.update(toastId.current, {
        render: error?.message || "Error Adding File",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 3000);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrToNull();
    setFormError(null);
    console.log(formData);
    var check = await validatePassword();
    if (!check) return;
    try {
      toastId.current = toast.loading("Loading...");
      const data = await post("/User/signup", formData);
      toast.update(toastId.current, {
        render: "Sign Up Successful",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
      navigateToLoginPage();
    } catch (err) {
      sessionStorage.removeItem(accessToken);
      sessionStorage.removeItem(refreshToken);
      toast.update(toastId.current, {
        render: error?.message || "Error signing in",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 3000);
    }

    // if (data) {
    //   navigateToLoginPage();
    // }

    // sessionStorage.setItem("tokenA", data?.data?.accessToken);
    // sessionStorage.setItem("tokenR", data?.data?.refreshToken);

    // console.log("Success");

    // console.log(data);
  };

  return (
    <AppModal onCloseModal={handleModalClose}>
      <>
        {deleteModal && (
          <CausionModal
            message={`Are you sure you want to delete the file ${fileName}`}
            onCloseModal={() => setDeleteModal(false)}
            handleAction={deleteActivityFile}
          />
        )}
        <div className=" flex justify-between items-center flex-wrap  gap-4">
          <h2 className="font-semibold text-2xl">Activity</h2>

          <p className="text-xs md:text-sm lg:text-base">ID: {id}</p>
        </div>
        <div className="pm-modal-body">
          <div className="flex justify-between mt-5 flex-wrap gap-4">
            <div className="w-full lg:w-70">
              {editActivity ? (
                <TextAreaField
                  InputValue={name}
                  InputTitle={"Name"}
                  InputName={"name"}
                  OnChange={handleChange}
                />
              ) : (
                <FormItemDisplay title={"Name"} value={name} />
              )}
            </div>
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Status"}
                value={activityStatus[status]}
              />
            </div>
          </div>
          <div className="datesWrapper flex justify-between mt-3 flex-wrap gap-4">
            {editActivity && status == 1 ? (
              <div className="w-full sm:w-2.5/5 flex  justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                <div className="w-2.5/5 min-w-fit">
                  <InputField
                    InputValue={startDate}
                    InputTitle={"Start Date (mm-dd-yy)"}
                    type="date"
                    InputName={"startDate"}
                    OnChange={handleChange}
                  />
                </div>
                <div className="w-2.5/5 min-w-fit">
                  <InputField
                    InputValue={endDate}
                    OnChange={handleChange}
                    InputTitle={"End Date (mm-dd-yy)"}
                    type="date"
                    InputName={"endDate"}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full sm:w-2.5/5 flex justify-between flex-wrap min-w-fit gap-4 sm:flex-nowrap">
                <div className="w-2.5/5 min-w-fit">
                  <FormItemDisplay
                    title={"Start Date"}
                    value={startDate ? GetDate(startDate) : "No date"}
                    Style={"min-w-fit"}
                  />
                </div>
                <div className="w-2.5/5 min-w-fit">
                  <FormItemDisplay
                    title={"End Date"}
                    value={endDate ? GetDate(endDate) : "No date"}
                  />
                </div>
              </div>
            )}

            {status != 1 && (
              <>
                {editActualDates && status == 2 ? (
                  <div className="w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                    <div className=" w-2.5/5 min-w-fit">
                      <InputField
                        InputValue={actualStartDate}
                        InputTitle={"Actual Start Date (mm-dd-yy)"}
                        type="date"
                        InputName={"actualStartDate"}
                        OnChange={handleChange}
                      />
                    </div>
                    <div className=" w-2.5/5 min-w-fit">
                      <InputField
                        InputValue={actualEndDate}
                        OnChange={handleChange}
                        InputTitle={"Actual End Date (mm-dd-yy)"}
                        type="date"
                        InputName={"actualEndDate"}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                    <div className=" w-2.5/5 min-w-fit">
                      <FormItemDisplay
                        title={"Acual Start Date"}
                        value={
                          actualStartDate ? GetDate(actualStartDate) : "No date"
                        }
                      />
                    </div>
                    <div className="w-2.5/5 min-w-fit">
                      <FormItemDisplay
                        title={"Acual End Date"}
                        value={
                          actualEndDate ? GetDate(actualEndDate) : "No date"
                        }
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-3">
            {editActivity ? (
              <TextAreaField
                InputValue={description}
                InputTitle={"Description"}
                InputName={"description"}
                OnChange={handleChange}
              />
            ) : (
              <FormItemDisplayBig title={"Description"} value={description} />
            )}
          </div>
          <div className="w-1/4 min-w-fit mt-3">
            {editActivity ? (
              <SelectInputField
                InputValue={projectPhase}
                InputTitle={"Project Phase"}
                InputName={"projectPhase"}
                OnChange={handleChange}
                selectOptions={[
                  { value: 0, text: "Select an Option" },
                  { value: 1, text: "Pre-Construction" },
                  { value: 2, text: "Construction" },
                  { value: 3, text: "Post-Construction" },
                ]}
              />
            ) : (
              <FormItemDisplay
                title={"Project Phase:"}
                value={constructionPhasesValue[projectPhase]}
              />
            )}
          </div>
          <div className="mt-3">
            <p className="ml-3 text-xs font-inter ">File Attached</p>
            <div
              style={{ borderColor: "rgb(0,0,0,0.6)" }}
              className={` ${
                fileInputDisplay
                  ? "!border-indigo-400 focus:!border-indigo-700 focus:!outline-none"
                  : ""
              }flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base `}
            >
              {fileInputDisplay ? (
                <input type="file" onChange={handleFileChange} />
              ) : (
                <p>{fileName ? `${fileName}` : "No file"}</p>
              )}
              <div>
                {fileName && (
                  <div className="flex flex-wrap gap-1 max-w-fit justify-end sm:justify-normal">
                    <DownloadBtn OnClick={downloadActivityFile} />
                    {status === 1 && (
                      <DeleteBtn OnClick={() => setDeleteModal(true)} />
                    )}
                  </div>
                )}
                {!fileName && status === 1 && !fileInputDisplay && (
                  <SmallDefaultBtn OnClick={() => setFileInputDisplay(true)}>
                    Add File
                  </SmallDefaultBtn>
                )}
                {!fileName &&
                  status === 1 &&
                  fileInputDisplay &&
                  activityFile && (
                    <SmallDefaultBtn OnClick={addActivityFile}>
                      Save File
                    </SmallDefaultBtn>
                  )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {status === 1 && (
              <>
                {editActivity ? (
                  <GeneralBtn>Submit</GeneralBtn>
                ) : (
                  <GeneralBtn OnClick={() => setEditActivity(true)}>
                    Edit
                  </GeneralBtn>
                )}

                <GeneralBtn>Delete</GeneralBtn>
              </>
            )}

            {status === 2 && (
              <>
                {editActualDates ? (
                  <GeneralBtn>Save Changes</GeneralBtn>
                ) : (
                  <GeneralBtn OnClick={() => setEditActualDates(true)}>
                    Update actual dates
                  </GeneralBtn>
                )}
                <GeneralBtn>Set As Done</GeneralBtn>
              </>
            )}
          </div>
        </div>
      </>
    </AppModal>
  );
};
const ModalOld = ({
  onCloseModal,
  selectedActivity,
  removeSelectedActivity,
}) => {
  // const [approvalSuccess, setApprovalSuccess] = useState(null);
  // const [rejectionSuccess, setRejectionSuccess] = useState(null);
  const [editDates, setEditDates] = useState(null);
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
      `/Activity/OtherPro/DownloadActivityFile?projectId=${projectId}&ActivityId=${id}&FileName=${fileName}`,
      fileName
    );
  };

  return (
    <div className="activity-modal-overlay">
      {/* <div className="activity-modal-container" onClick={(e) => e.stopPropagation()}> */}
      <div className="activity-display-modal-container ">
        <button onClick={onCloseModal}>Close</button>
        <div className="activity-modal-header">
          <h2>Activity</h2>

          {/* <span>Activity ID: {activityId}</span> */}
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

export default OtherProActivity;
