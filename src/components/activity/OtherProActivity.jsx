import React, { useEffect, useRef } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../loading/Loading";
import Pagination from "../pagination/Pagination";
import { ApiDateFormat, GetDate } from "../../utils/timeUtil";
import "./OtherProActivity.css";
import {
  paginationPageSize,
  // userProfession,
  activityStatus,
  constructionPhasesValue,
  AddSerialNumber,
  activityStatusKey,
  constructionPhases,
} from "../../utils/constants";
import OtherProTable from "../utility/table/OtherProTable";
import NonFound from "../utility/NonFound";
import GetErrorNotification from "../utility/GetErrorNotification";
// import { FaRemoveFormat } from "react-icons/fa";
import {
  // TextInput,
  InputField,
  TextAreaField,
  SelectInputField,
  SearchSelect,
} from "../utility/InputFields";
import GeneralBtn, {
  ClearBtn,
  SubmitGeneralBtn,
} from "../utility/buttons/MainBtns";
import FormItemDisplay, {
  FormItemDisplayBig,
} from "../utility/FormItemDisplay";
// import { FaXmark } from "react-icons/fa6";
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
  const [preConstCurrentPage, setPreConstCurrentPage] = useState(1);
  const [constCurrentPage, setConstCurrentPage] = useState(1);
  const [postConstCurrentPage, setPostConstCurrentPage] = useState(1);

  const [preConsPhaseData, setPreConsPhaseData] = useState(null);
  const [consPhaseData, setConsPhaseData] = useState(null);
  const [postConsPhaseData, setPostConsPhaseData] = useState(null);
  const [viewForm, setViewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [refreshPage, SetRefreshPage] = useState(false);
  const [formData, setFormData] = useState({
    requiredDate: "",
    requiredStatus: "",
  });
  const [isSearch, setIsSearch] = useState(false);
  const [displaySearch, setDisplaySearch] = useState(false);

  const handleChange = (e) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSearch = (e) => {
    setIsSearch(!isSearch);
    setDisplaySearch(true);
  };

  const handleSearchClear = () => {
    setFormData({ requiredDate: "", requiredStatus: "" });
    setDisplaySearch(false);
    setIsSearch(!isSearch);
  };

  const onCloseDetail = (isRefresh) => {
    setSelectedActivity(null);
    setViewDetail(false);
    if (isRefresh) {
      SetRefreshPage(!refreshPage);
    }
  };

  const displayActivity = (item) => {
    setSelectedActivity(item);
    setViewDetail(true);
  };

  const closeForm = (isRefresh) => {
    setViewForm(false);
    if (isRefresh) {
      SetRefreshPage(!refreshPage);
    }
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
    let preConsUrl = `/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=1&pageNumber=${preConstCurrentPage}&pageSize=${paginationPageSize}&requiredDate=${formData.requiredDate}&requiredStatus=${formData.requiredStatus}`;

    const fetchPreConsData = async () => {
      try {
        const response = await preConsGet(preConsUrl);
        setPreConsPhaseData(response);
        preConsSetErrToNull();
      } catch (err) {
        setPreConsPhaseData(null);
      }
    };

    fetchPreConsData();
  }, [projectId, preConstCurrentPage, userInfo, refreshPage, isSearch]);

  useEffect(() => {
    let consUrl = `/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=2&pageNumber=${constCurrentPage}&pageSize=${paginationPageSize}&requiredDate=${formData.requiredDate}&requiredStatus=${formData.requiredStatus}`;

    const fetchConsData = async () => {
      try {
        const response = await consGet(consUrl);
        setConsPhaseData(response);
        consSetErrToNull();
      } catch (err) {
        setConsPhaseData(null);
      }
    };

    fetchConsData();
  }, [projectId, constCurrentPage, userInfo, refreshPage, isSearch]);

  useEffect(() => {
    let postConsUrl = `/Activity/OtherPro/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=3&pageNumber=${postConstCurrentPage}&pageSize=${paginationPageSize}&requiredDate=${formData.requiredDate}&requiredStatus=${formData.requiredStatus}`;

    const fetchPostConsData = async () => {
      try {
        const response = await postConsGet(postConsUrl);
        setPostConsPhaseData(response);
        postConsSetErrToNull();
      } catch (err) {
        setPostConsPhaseData(null);
      }
    };

    fetchPostConsData();
  }, [projectId, postConstCurrentPage, userInfo, refreshPage, isSearch]);

  return (
    <>
      <button
        onClick={() => {
          setViewForm(true);
        }}
        className="mt-3 block ml-auto border-2 border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base"
      >
        Create Activity
      </button>

      <>
        <div className="activity-tables">
          <div className="mt-3 mb-8 flex min-w-fit flex-wrap gap-2 sm:gap-4 items-center">
            <div className="w-1/5 min-w-fit">
              <SelectInputField
                InputValue={formData.requiredStatus}
                InputTitle={"Status"}
                InputName={"requiredStatus"}
                OnChange={handleChange}
                selectOptions={[
                  { value: "", text: "All" },
                  { value: "1", text: "Pending" },
                  { value: "2", text: "Awaiting Approval" },
                  { value: "3", text: "Approved" },
                  { value: "4", text: "Rejected" },
                  { value: "5", text: "Done" },
                ]}
              />
            </div>
            <div className=" min-w-fit">
              <InputField
                InputValue={formData.requiredDate}
                InputTitle={"Required Date (mm-dd-yy)"}
                type="date"
                InputName={"requiredDate"}
                OnChange={handleChange}
              />
            </div>
            <div className="flex gap-2 sm:gap-4">
              <div className="pt-5">
                <GeneralBtn OnClick={handleSearch}>Search</GeneralBtn>
              </div>
              <div className="pt-5">
                <ClearBtn OnClick={handleSearchClear}>Clear</ClearBtn>
              </div>
            </div>
          </div>
          {(preConsLoading || consLoading || postConsLoading) && <Loader />}
          <div className="phase-wrapper">
            {preConsPhaseData?.data?.length > 0 &&
              !preConsLoading &&
              !preConsError && (
                <>
                  <p className="my-3 font-bold text-xs md:text-sm lg:text-base">
                    Pre-Construction Phase Activities
                    {displaySearch &&
                      ` (${GetDate(ApiDateFormat(formData.requiredDate))})`}
                  </p>
                  <div
                    style={{ width: "98%" }}
                    className="tableContainer mx-auto mb-3"
                  >
                    <OtherProTable
                      items={AddSerialNumber(
                        preConsPhaseData?.data,
                        preConstCurrentPage,
                        paginationPageSize
                      )}
                      displayActivity={displayActivity}
                    />
                  </div>
                  <Pagination
                    className="pagination-bar"
                    currentPage={preConstCurrentPage}
                    totalCount={preConsPhaseData?.pagination?.totalCount}
                    pageSize={paginationPageSize}
                    onPageChange={(page) => setPreConstCurrentPage(page)}
                  />
                </>
              )}
            {preConsPhaseData?.data?.length == 0 && !preConsLoading && (
              <div className="sm:my-10">
                <NonFound
                  customMessage={
                    displaySearch
                      ? "No Preconstruction Activity based on search criteria"
                      : "User has not created any Preconstruction Activity"
                  }
                />
              </div>
            )}
            {preConsError && !preConsLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  customMessage={preConsError?.message}
                  message={"Pre-Construction Phase Activities"}
                />
              </div>
            )}
          </div>
          <div className="phase-wrapper mt-10">
            {consPhaseData?.data?.length > 0 && !consLoading && !consError && (
              <>
                <p className="font-bold text-xs md:text-sm lg:text-base my-3">
                  Construction Phase Activities
                  {displaySearch &&
                    ` (${GetDate(ApiDateFormat(formData.requiredDate))})`}
                </p>
                <div
                  style={{ width: "98%" }}
                  className="tableContainer mx-auto mb-3"
                >
                  <OtherProTable
                    items={AddSerialNumber(
                      consPhaseData?.data,
                      constCurrentPage,
                      paginationPageSize
                    )}
                    displayActivity={displayActivity}
                  />
                </div>
                <Pagination
                  className="pagination-bar"
                  currentPage={constCurrentPage}
                  totalCount={consPhaseData?.pagination?.totalCount}
                  pageSize={paginationPageSize}
                  onPageChange={(page) => setConstCurrentPage(page)}
                />
              </>
            )}
            {consPhaseData?.data?.length == 0 && !consLoading && !consError && (
              <div className="sm:my-10">
                <NonFound
                  customMessage={
                    displaySearch
                      ? "No Construction Activity based on search criteria"
                      : "User has not created any Construction Activity"
                  }
                />
              </div>
            )}
            {consError && !consLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  customMessage={consError?.message}
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
                    {displaySearch &&
                      ` (${GetDate(ApiDateFormat(formData.requiredDate))})`}
                  </p>
                  <div
                    style={{ width: "98%" }}
                    className="tableContainer mx-auto mb-3"
                  >
                    <OtherProTable
                      items={AddSerialNumber(
                        postConsPhaseData?.data,
                        postConstCurrentPage,
                        paginationPageSize
                      )}
                      displayActivity={displayActivity}
                    />
                  </div>
                  <Pagination
                    className="pagination-bar"
                    currentPage={postConstCurrentPage}
                    totalCount={postConsPhaseData?.pagination?.totalCount}
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
                      displaySearch
                        ? "No Post-Construction Activity based on search criteria"
                        : "User has not created any Post-Construction Activity"
                    }
                  />
                </div>
              )}
            {postConsError && !postConsLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  customMessage={postConsError?.message}
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
          // pageRefresh={SetRefreshPage}
        />
      )}
    </>
  );
};

const CreateActivityModal = ({ onClose, projectId }) => {
  const [activityData, setActivityData] = useState({
    name: "",
    description: "",
    projectPhase: "",
    startDate: "",
    endDate: "",
    file: null,
  });

  const maxSizeInMB = 300; // Maximum file size in MB
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to Bytes

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid black",
      borderRadius: "8px",
      // outline: "none"
      // "&:focus": {
      //   borderColor: "black",
      // },
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const {
    loading: postFileReqLoading,
    error: postFileReqError,
    setErrToNull: postFileReqSetErrToNull,
    postFileReq,
  } = useAPI();

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
        toast.error("Only word, pdf, and image files are allowed.");
      }

      if (file && file.size > maxSizeInBytes) {
        toast.error(
          `File size exceeds the ${maxSizeInMB}MB limit. Please upload a smaller file.`
        );
      }

      setActivityData({ ...activityData, [name]: file });
    } else {
      setActivityData({ ...activityData, [name]: value });
    }
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;

    if (value.trim().length <= 200) {
      setActivityData({ ...activityData, [name]: value });
    } else {
      toast.error(
        "Character limit exceeded. You can only enter up to 200 characters."
      );
    }
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;

    if (value.trim().length <= 500) {
      setActivityData({ ...activityData, [name]: value });
      //  setError("");
    } else {
      toast.error(
        "Character limit exceeded. You can only enter up to 500 characters."
      );
    }
  };

  const handleProjectPhaseChange = (selectedOption) => {
    setActivityData({
      ...activityData,
      projectPhase: selectedOption,
    });
  };

  const closeModalForm = (refresh) => {
    setActivityData({
      name: "",
      description: "",
      projectPhase: "",
      startDate: "",
      endDate: "",
      file: null,
    });

    onClose(refresh);
  };

  const toastId = useRef(null);

  const handleFormErrors = async () => {
    if (!activityData.name) {
      toast.error("Name must not be empty");
      return true;
    }
    if (!activityData.startDate) {
      toast.error("Start Date must be chosen");
      return true;
    }
    if (!activityData.endDate) {
      toast.error("End Date must be chosen");
      return true;
    }
    // if (!activityData.description) {
    //   toast.error("Description must not be empty");
    //   return true;
    // }
    if (!activityData.projectPhase) {
      toast.error("Project Phase must be selected");
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    postFileReqSetErrToNull();

    const errors = await handleFormErrors();
    if (errors) {
      return;
    }

    // Validate end date is not before start date
    if (new Date(activityData.endDate) < new Date(activityData.startDate)) {
      toast.error("End date cannot be before start date");
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
      toast.error("Only word, pdf, and image files are allowed.");
      return;
    }

    if (activityData.file?.size > maxSizeInBytes) {
      toast.error(
        `File size exceeds the ${maxSizeInMB}MB limit. Please upload a smaller file.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("name", activityData.name.trim());
    formData.append("description", activityData.description.trim());
    formData.append("projectPhase", activityData.projectPhase?.value);
    formData.append("startDate", activityData.startDate);
    formData.append("endDate", activityData.endDate);
    formData.append("file", activityData.file);

    try {
      toastId.current = toast.loading("Loading...");

      await postFileReq("/Activity/OtherPro/CreateActivity", formData);

      toast.update(toastId.current, {
        render: "Activity created Successfully",
        type: "success",
        isLoading: false,
      });

      setTimeout(() => {
        toast.dismiss();
      }, 4000);

      closeModalForm(true);
    } catch (err) {
      toast.update(toastId.current, {
        render: postFileReqError?.message || "Error Occurred",
        type: "error",
        isLoading: false,
      });

      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  return (
    <>
      <AppModal onCloseModal={() => closeModalForm(false)}>
        <h2 className="font-semibold text-2xl mb-5">Create Activity</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mt-3">
            <InputField
              InputValue={activityData.name}
              InputTitle={"Name"}
              InputName={"name"}
              OnChange={handleNameChange}
              maximumLength={200}
            />
          </div>
          <div className="w-full sm:w-2.5/5 flex  justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap mt-3">
            <div className="w-2.5/5 min-w-fit">
              <InputField
                InputValue={activityData?.startDate}
                InputTitle={"Start Date (mm-dd-yy)"}
                type="date"
                InputName={"startDate"}
                OnChange={handleChange}
              />
            </div>
            <div className="w-2.5/5 min-w-fit">
              <InputField
                InputValue={activityData?.endDate}
                OnChange={handleChange}
                InputTitle={"End Date (mm-dd-yy)"}
                type="date"
                InputName={"endDate"}
              />
            </div>
          </div>
          <div className="mt-3">
            <TextAreaField
              InputValue={activityData.description}
              InputTitle={"Description"}
              InputName={"description"}
              OnChange={handleDescriptionChange}
              maximumLength={500}
            />
          </div>
          <div className=" w-2.5/5 min-w-fit mt-3">
            <SearchSelect
              InputValue={activityData.projectPhase}
              InputTitle={"Project Phase"}
              InputName={"projectPhase"}
              OnChange={handleProjectPhaseChange}
              selectOptions={constructionPhases}
              customStyles={customStyles}
              Searchable={true}
            />
          </div>
          <div className="mt-3">
            <label className="ml-3 text-xs font-inter ">File:</label>
            <div className="border-black-60 focus:border-black focus:outline-none rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base">
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-3">
            <SubmitGeneralBtn loading={postFileReqLoading}>
              Submit
            </SubmitGeneralBtn>
          </div>
        </form>
      </AppModal>
    </>
  );
};

const Modal = ({ onCloseModal, selectedActivity }) => {
  const [editActivity, setEditActivity] = useState(false);
  const [editActualDates, setEditActualDates] = useState(false);
  const [formData, setFormData] = useState({
    ...selectedActivity,
    startDate: format(new Date(selectedActivity.startDate), "yyyy-MM-dd"),
    endDate: format(new Date(selectedActivity.endDate), "yyyy-MM-dd"),
    actualStartDate:
      selectedActivity.actualStartDate &&
      format(new Date(selectedActivity.actualStartDate), "yyyy-MM-dd"),
    actualEndDate:
      selectedActivity.actualEndDate &&
      format(new Date(selectedActivity.actualEndDate), "yyyy-MM-dd"),
  });
  const [fileInputDisplay, setFileInputDisplay] = useState(false);
  const [activityFile, setActivityFile] = useState(null);
  const [activityChange, setActivityChange] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileDelete, setFileDelete] = useState(false);

  const maxSizeInMB = 300; // Maximum file size in MB
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to Bytes

  const handleNameChange = (e) => {
    const { name, value } = e.target;

    if (value.trim().length <= 200) {
      setFormData({ ...formData, [name]: value });
    } else {
      toast.error(
        "Character limit exceeded. You can only enter up to 200 characters."
      );
    }
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;

    if (value.trim().length <= 500) {
      setFormData({ ...formData, [name]: value });
    } else {
      toast.error(
        "Character limit exceeded. You can only enter up to 500 characters."
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = (passedChange = false) => {
    if (passedChange || activityChange) {
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
    error: downloadFileError,
    setErrToNull: downloadSetErrToNull,
    downloadFile: downloadGet,
  } = useAPI();

  const {
    error: deleteFileError,
    setErrToNull: deleteSetErrToNull,
    deleteRequest: deleteFile,
  } = useAPI();

  const {
    error: addFileError,
    setErrToNull: addFileSetErrToNull,
    patchFileReq: addFile,
  } = useAPI();

  const {
    error: actualDatesError,
    setErrToNull: actualDatesSetErrToNull,
    patch: updateActualDatesReq,
  } = useAPI();

  const {
    error: activityUpdateError,
    setErrToNull: activityUpdateSetErrToNull,
    patch: activityUpdateReq,
  } = useAPI();

  const {
    error: activityToDoneError,
    setErrToNull: activityToDoneReqSetErrToNull,
    patch: activityToDoneReq,
  } = useAPI();

  const {
    error: deleteActivityError,
    setErrToNull: deleteActivitySetErrToNull,
    deleteRequest: deleteActivityReq,
  } = useAPI();

  const {
    error: activitySendForApprovalError,
    setErrToNull: activitySendForApprovalSetErrToNull,
    patch: activitySendForConfirmationReq,
  } = useAPI();

  const handleActivityDelete = async () => {
    deleteActivitySetErrToNull();
    try {
      toastId.current = toast.loading("Loading...");
      await deleteActivityReq(
        `/Activity/OtherPro/DeleteActivity/${projectId}/${id}`
      );

      toast.update(toastId.current, {
        render: "Activity Deleted Successfully",
        type: "success",
        isLoading: false,
      });

      // setActivityChange(true);
      setFormData(null);
      handleModalClose(true);

      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: deleteActivityError?.message || "Error Deleting Activity",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  const handleActivityToDone = async () => {
    activityToDoneReqSetErrToNull();
    const reqbody = {
      activityId: id,
      projectId,
    };

    try {
      toastId.current = toast.loading("Loading...");
      await activityToDoneReq(
        `/Activity/OtherPro/UpdateActivityToDone`,
        reqbody
      );

      setFormData({ ...formData, status: activityStatusKey.Done });
      setActivityChange(true);
      toast.update(toastId.current, {
        render: "Updated Successfully",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: activityToDoneError?.message || "Error Occurred",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  const handleSubmitForApproval = async () => {
    activitySendForApprovalSetErrToNull();

    const reqbody = {
      activityId: id,
      projectId,
      statusAction: activityStatusKey["Awaiting Approval"],
    };
    try {
      toastId.current = toast.loading("Loading...");
      await activitySendForConfirmationReq(
        `/Activity/OtherPro/SendForApproval`,
        reqbody
      );
      // setEditActivity(false);
      setFormData({
        ...formData,
        status: activityStatusKey["Awaiting Approval"],
      });
      setActivityChange(true);
      toast.update(toastId.current, {
        render: "Updated Successfully",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: activitySendForApprovalError?.message || "Error Occurred",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  const handleUpdateErrors = async () => {
    if (!formData.name) {
      toast.error("Name must not be empty");
      return true;
    }

    if (!formData.status) {
      toast.error("Status must not be empty");
      return true;
    }

    if (!formData.startDate) {
      // setFormError("Name must not be empty");
      toast.error("Start Date must be chosen");
      return true;
    }
    if (!formData.endDate) {
      // setFormError("Name must not be empty");
      toast.error("End Date must be chosen");
      return true;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    //  if (!formData.description) {
    //    toast.error("Description must not be empty");
    //    return true;
    //  }
    if (!formData.projectPhase) {
      // setFormError("Name must not be empty");
      toast.error("Project Phase must be selected");
      return true;
    }

    return false;
  };

  const handleActivityUpdate = async () => {
    activityUpdateSetErrToNull();

    const errors = await handleUpdateErrors();
    if (errors) {
      return;
    }

    const reqbody = {
      activityId: id,
      projectId,
      name: name?.trim(),
      description: description?.trim(),
      projectPhase,
      startDate: ApiDateFormat(startDate),
      endDate: ApiDateFormat(endDate),
    };
    try {
      toastId.current = toast.loading("Loading...");
      await activityUpdateReq(
        `/Activity/OtherPro/UpdatePendingActivityDetails`,
        reqbody
      );
      setEditActivity(false);
      setActivityChange(true);
      toast.update(toastId.current, {
        render: "Updated Successfully",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: activityUpdateError?.message || "Error Occurred",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  const handleActualDatesUpdate = async () => {
    actualDatesSetErrToNull();

    if (!formData.actualStartDate) {
      // setFormError("Name must not be empty");
      toast.error("Actual start date must be chosen");
      return true;
    }
    if (!formData.actualEndDate) {
      // setFormError("Name must not be empty");
      toast.error("Actual end date must be chosen");
      return true;
    }

    if (new Date(formData.actualEndDate) < new Date(formData.actualStartDate)) {
      toast.error("Actual end date cannot be before Actual start date");
      return;
    }

    const reqbody = {
      activityId: id,
      projectId,
      actualStartDate: ApiDateFormat(actualStartDate),
      actualEndDate: ApiDateFormat(actualEndDate),
    };
    try {
      toastId.current = toast.loading("Loading...");
      await updateActualDatesReq(
        `/Activity/OtherPro/UpdateActivityActualDates`,
        reqbody
      );
      setEditActualDates(false);
      setActivityChange(true);
      toast.update(toastId.current, {
        render: "Updated Successfully",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: actualDatesError?.message || "Error Occurred",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  const toastId = useRef(null);
  const handleActivityFileDownload = async () => {
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
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: downloadFileError?.message || "Error Downloading File",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  const handleActivityFileDelete = async () => {
    deleteSetErrToNull();
    try {
      toastId.current = toast.loading("Deleting File...");
      await deleteFile(
        `/Activity/OtherPro/DeletePendingActivityFile?projectId=${projectId}&ActivityId=${id}&FileName=${fileName}`
      );
      setActivityChange(true);
      setFormData({ ...formData, fileName: null });
      toast.update(toastId.current, {
        render: "File Deleted Successfully",
        type: "success",
        isLoading: false,
      });
      setDeleteModal(false);
      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: deleteFileError?.message || "Error Deleting File",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  const removeEditActualDates = () => {
    setEditActualDates(false);
    setFormData({
      ...formData,
      actualStartDate:
        selectedActivity.actualStartDate &&
        format(new Date(selectedActivity.actualStartDate), "yyyy-MM-dd"),
      actualEndDate:
        selectedActivity.actualEndDate &&
        format(new Date(selectedActivity.actualEndDate), "yyyy-MM-dd"),
    });
  };

  const removeEdit = () => {
    setEditActivity(false);
    setFormData({
      ...selectedActivity,
      startDate: format(new Date(selectedActivity.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(selectedActivity.endDate), "yyyy-MM-dd"),
      actualStartDate:
        selectedActivity.actualStartDate &&
        format(new Date(selectedActivity.actualStartDate), "yyyy-MM-dd"),
      actualEndDate:
        selectedActivity.actualEndDate &&
        format(new Date(selectedActivity.actualEndDate), "yyyy-MM-dd"),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file && !allowedTypes.includes(file.type)) {
      toast.error("Only word, pdf, and image files are allowed.");
    }

    if (file && file.size > maxSizeInBytes) {
      toast.error(
        `File size exceeds the ${maxSizeInMB}MB limit. Please upload a smaller file.`
      );
    }

    setActivityFile(file);
  };

  const handleAddActivityFile = async () => {
    addFileSetErrToNull();

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (activityFile?.type && !allowedTypes.includes(activityFile?.type)) {
      // setFormError("Only word, pdf, and image files are allowed.");
      toast.error("Only word, pdf, and image files are allowed.");
      return;
    }

    if (activityFile?.size > maxSizeInBytes) {
      toast.error(
        `File size exceeds the ${maxSizeInMB}MB limit. Please upload a smaller file.`
      );
      return;
    }

    try {
      const fileData = new FormData();
      fileData.append("projectId", projectId);
      fileData.append("activityId", id);
      fileData.append("file", activityFile);

      toastId.current = toast.loading("Adding File...");
      await addFile("/Activity/OtherPro/AddActivityFile", fileData);
      setActivityChange(true);
      setFormData({ ...formData, fileName: activityFile.name });
      setFileInputDisplay(false);

      toast.update(toastId.current, {
        render: "File Added Successfully",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: addFileError?.message || "Error Adding File",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);
    }
  };

  return (
    <AppModal onCloseModal={handleModalClose}>
      <>
        {deleteModal && (
          <CausionModal
            message={
              fileDelete
                ? `Are you sure you want to delete the file ${fileName}`
                : `Are you sure you want to delete the activity with ID: ${id}`
            }
            onCloseModal={() => {
              setFileDelete(false);
              setDeleteModal(false);
            }}
            handleAction={
              fileDelete ? handleActivityFileDelete : handleActivityDelete
            }
          />
        )}
        <div className=" flex justify-between items-center flex-wrap  gap-4">
          <h2 className="font-semibold text-2xl">Activity</h2>

          <p className="text-xs md:text-sm lg:text-base">ID: {id}</p>
        </div>
        <div className="pm-modal-body">
          <div className="flex justify-between mt-5 flex-wrap gap-4">
            <div className="w-full lg:w-70">
              {editActivity && status == 1 ? (
                <InputField
                  InputValue={name}
                  InputTitle={"Name"}
                  InputName={"name"}
                  OnChange={handleNameChange}
                  maximumLength={200}
                  editMode={editActivity}
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
                    editMode={editActivity}
                  />
                </div>
                <div className="w-2.5/5 min-w-fit">
                  <InputField
                    InputValue={endDate}
                    OnChange={handleChange}
                    InputTitle={"End Date (mm-dd-yy)"}
                    type="date"
                    InputName={"endDate"}
                    editMode={editActivity}
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
            <>
              {/* {editActualDates && status == 2 ? ( */}
              {editActualDates && status == 3 ? (
                <div className="w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                  <div className=" w-2.5/5 min-w-fit">
                    <InputField
                      InputValue={actualStartDate}
                      InputTitle={"Actual Start Date (mm-dd-yy)"}
                      type="date"
                      InputName={"actualStartDate"}
                      OnChange={handleChange}
                      editMode={editActualDates}
                    />
                  </div>
                  <div className=" w-2.5/5 min-w-fit">
                    <InputField
                      InputValue={actualEndDate}
                      OnChange={handleChange}
                      InputTitle={"Actual End Date (mm-dd-yy)"}
                      type="date"
                      InputName={"actualEndDate"}
                      editMode={editActualDates}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                  <div className=" w-2.5/5 min-w-fit">
                    <FormItemDisplay
                      title={"Actual Start Date"}
                      value={
                        actualStartDate ? GetDate(actualStartDate) : "No date"
                      }
                    />
                  </div>
                  <div className="w-2.5/5 min-w-fit">
                    <FormItemDisplay
                      title={"Actual End Date"}
                      value={actualEndDate ? GetDate(actualEndDate) : "No date"}
                    />
                  </div>
                </div>
              )}
            </>
          </div>
          <div className="mt-3">
            {editActivity && status == 1 ? (
              <TextAreaField
                InputValue={description}
                InputTitle={"Description"}
                InputName={"description"}
                OnChange={handleDescriptionChange}
                editMode={editActivity}
                maximumLength={500}
              />
            ) : (
              <FormItemDisplayBig title={"Description"} value={description} />
            )}
          </div>
          <div className="w-1/4 min-w-fit mt-3">
            {editActivity && status == 1 ? (
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
                editMode={editActivity}
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
                    <DownloadBtn OnClick={handleActivityFileDownload} />
                    {status === 1 && (
                      <DeleteBtn
                        OnClick={() => {
                          setFileDelete(true);
                          setDeleteModal(true);
                        }}
                      />
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
                    <SmallDefaultBtn OnClick={handleAddActivityFile}>
                      Save File
                    </SmallDefaultBtn>
                  )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {formData.status === 1 && !editActivity && (
              <GeneralBtn
                OnClick={() => {
                  handleSubmitForApproval();
                }}
              >
                Send For Approval
              </GeneralBtn>
            )}
            {status === 1 && (
              <>
                {editActivity ? (
                  <>
                    {" "}
                    <GeneralBtn OnClick={handleActivityUpdate}>
                      Submit
                    </GeneralBtn>
                    <ClearBtn OnClick={removeEdit}> Cancel</ClearBtn>
                  </>
                ) : (
                  <GeneralBtn OnClick={() => setEditActivity(true)}>
                    Edit
                  </GeneralBtn>
                )}
              </>
            )}

            {/* {status === 3 && ( */}
            {(status === 1 || status === 4) && !editActivity && (
              <ClearBtn
                OnClick={() => {
                  setDeleteModal(true);
                }}
              >
                Delete
              </ClearBtn>
            )}

            {/* //check this condition */}
            {/* {status === 3 && ( */}
            {status === 3 && (
              <>
                {editActualDates && !editActivity ? (
                  <>
                    <GeneralBtn OnClick={handleActualDatesUpdate}>
                      Save Changes
                    </GeneralBtn>
                    <ClearBtn OnClick={removeEditActualDates}>Cancel</ClearBtn>
                  </>
                ) : (
                  <GeneralBtn OnClick={() => setEditActualDates(true)}>
                    Update actual dates
                  </GeneralBtn>
                )}
                {!editActualDates && (
                  <GeneralBtn OnClick={handleActivityToDone}>
                    Set As Done
                  </GeneralBtn>
                )}
              </>
            )}
          </div>
        </div>
      </>
    </AppModal>
  );
};

export default OtherProActivity;

// const CreateActivityModalOld = ({ onClose, projectId }) => {
//   const [activityData, setActivityData] = useState({
//     name: "",
//     description: "",
//     projectPhase: "",
//     startDate: "",
//     endDate: "",
//     file: null,
//   });
//   const [success, setSuccess] = useState(null);
//   const [formError, setFormError] = useState(null);

//   const { loading, error, setErrToNull, postFileReq } = useAPI();

//   useEffect(() => {
//     if (error || formError)
//       var timeInterval = setInterval(() => {
//         setFormError(null);
//         setErrToNull();
//       }, 2000);

//     return () => clearInterval(timeInterval);
//   }, [error, formError]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file") {
//       const file = files[0];
//       const allowedTypes = [
//         "image/jpeg",
//         "image/png",
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ];
//       if (file && !allowedTypes.includes(file.type)) {
//         setFormError("Only word, pdf, and image files are allowed.");
//         return;
//       }
//       setActivityData({ ...activityData, [name]: file });
//     } else {
//       setActivityData({ ...activityData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrToNull();
//     setFormError();

//     // Validate end date is not before start date
//     if (new Date(activityData.endDate) < new Date(activityData.startDate)) {
//       setFormError("End date cannot be before start date");
//       return;
//     }

//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     if (
//       activityData.file?.type &&
//       !allowedTypes.includes(activityData.file?.type)
//     ) {
//       setFormError("Only word, pdf, and image files are allowed.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("projectId", projectId);
//       formData.append("name", activityData.name);
//       formData.append("description", activityData.description);
//       formData.append("projectPhase", activityData.projectPhase);
//       formData.append("startDate", activityData.startDate);
//       formData.append("endDate", activityData.endDate);
//       formData.append("file", activityData.file);

//       const response = await postFileReq(
//         "/Activity/OtherPro/CreateActivity",
//         formData
//       );
//       setSuccess(response?.message);

//       setTimeout(() => {
//         setSuccess(null);
//         closeModalForm(true);
//       }, 1000);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const closeModalForm = () => {
//     setActivityData({
//       name: "",
//       description: "",
//       projectPhase: "",
//       startDate: "",
//       endDate: "",
//       file: null,
//     });

//     onClose();
//   };

//   return (
//     <>
//       <div className="activity-modal-overlay">
//         <div className="activity-modal-container">
//           <div className="activity-modal-header">
//             <h2>Create Activity</h2>
//             <button onClick={closeModalForm}>Close</button>
//           </div>
//           {success && !loading && <p>Successfully created an activity</p>}
//           {formError && (
//             <div className="error-alert">
//               <p>{formError}</p>
//             </div>
//           )}
//           {error && !loading && (
//             <div className="error-alert">
//               <p>{error?.message}</p>
//             </div>
//           )}
//           <div className="activity-modal-body">
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//               <div className="activity-form-group">
//                 <label htmlFor="name">Name:</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={activityData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="activity-form-group">
//                 <label htmlFor="description">Description:</label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={activityData.description}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="activity-form-group">
//                 <label htmlFor="projectPhase">Project Phase:</label>
//                 <select
//                   id="projectPhase"
//                   name="projectPhase"
//                   value={activityData.projectPhase}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Project Phase</option>
//                   <option value="1">Preconstruction</option>
//                   <option value="2">Construction</option>
//                   <option value="3">Postconstruction</option>
//                 </select>
//               </div>
//               <div className="activity-form-group">
//                 <label htmlFor="startDate">Start Date:</label>
//                 <input
//                   type="date"
//                   id="startDate"
//                   name="startDate"
//                   value={activityData.startDate}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="activity-form-group">
//                 <label htmlFor="endDate">End Date:</label>
//                 <input
//                   type="date"
//                   id="endDate"
//                   name="endDate"
//                   value={activityData.endDate}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="activity-form-group">
//                 <label htmlFor="file">File:</label>
//                 <input
//                   type="file"
//                   id="file"
//                   name="file"
//                   onChange={handleChange}
//                   // required
//                 />
//               </div>
//               <button type="submit">Submit</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
