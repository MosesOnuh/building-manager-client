import React, { useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import Loader from "../loading/Loading";
import {
  activityStatus,
  paginationPageSize,
  userProfession,
} from "../../utils/constants";
import Pagination from "../pagination/Pagination";
import { ApiDateFormat, GetDate } from "../../utils/timeUtil";
import "./OtherProActivity.css";
import "./ClientActivity.css";
import { constructionPhasesValue } from "../../utils/constants";
import Pm_ClientTable from "../utility/table/Pm_ClientTable";
import { format } from "date-fns";
import AppModal from "../utility/Modals/Modal";
import FormItemDisplay, {
  FormItemDisplayBig,
} from "../utility/FormItemDisplay";
import { DownloadBtn } from "../utility/buttons/SmallBtns";
import { toast } from "react-toastify";
import GetErrorNotification from "../utility/GetErrorNotification";
import GeneralBtn, { ClearBtn } from "../utility/buttons/MainBtns";
import { InputField, SelectInputField } from "../utility/InputFields";
import NonFound from "../utility/NonFound";

const ClientActivity = ({ userInfo }) => {
  const [preConstCurrentPage, setPreConstCurrentPage] = useState(1);
  const [constCurrentPage, setConstCurrentPage] = useState(1);
  const [postConstCurrentPage, setPostConstCurrentPage] = useState(1);
  const [preConsPhaseData, setPreConsPhaseData] = useState(null);
  const [consPhaseData, setConsPhaseData] = useState(null);
  const [postConsPhaseData, setPostConsPhaseData] = useState(null);
  const [viewDetail, setViewDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
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
    // let preConsUrl = `https://localhost:7129/api/Activity/PM/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=1&pageNumber=${preConstCurrentPage}&pageSize=${paginationPageSize}&requiredDate=${formData.requiredDate}&requiredStatus=${formData.requiredStatus}`;
    let preConsUrl = `/Activity/PM/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=1&pageNumber=${preConstCurrentPage}&pageSize=${paginationPageSize}&requiredDate=${formData.requiredDate}&requiredStatus=${formData.requiredStatus}`;

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
  }, [projectId, preConstCurrentPage, userInfo, isSearch]);

  useEffect(() => {
    let consUrl = `/Activity/PM/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=2&pageNumber=${constCurrentPage}&pageSize=${paginationPageSize}&requiredDate=${formData.requiredDate}&requiredStatus=${formData.requiredStatus}`;

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
  }, [projectId, constCurrentPage, userInfo, isSearch]);

  useEffect(() => {
    let postConsUrl = `/Activity/PM/GetProjectPhaseActivities?projectId=${projectId}&projectPhase=3&pageNumber=${postConstCurrentPage}&pageSize=${paginationPageSize}&requiredDate=${formData.requiredDate}&requiredStatus=${formData.requiredStatus}`;

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
  }, [projectId, postConstCurrentPage, userInfo, isSearch]);

  return (
    <>
      {preConsError && (
        <div className="error-alert">
          <p>{preConsError?.message}</p>
        </div>
      )}

      <>
        <div className="activity-tables">
          <div className="mt-3 mb-10 flex min-w-fit flex-wrap gap-2 sm:gap-4 items-center">
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
                    <Pm_ClientTable
                      items={preConsPhaseData?.data}
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
                      : "No Preconstruction Activity has been created"
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
                  <Pm_ClientTable
                    items={consPhaseData?.data}
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
                      : "No Construction Activity has been created"
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
                    <Pm_ClientTable
                      items={postConsPhaseData?.data}
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
                        : "No Post-Construction Activity has been created"
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
      {viewDetail && (
        <Modal
          onCloseModal={onCloseDetail}
          selectedActivity={selectedActivity}
        />
      )}
    </>
  );
};

// const Modal = ({ onCloseModal, selectedActivity, pageRefresh }) => {
const Modal = ({ onCloseModal, selectedActivity }) => {
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

  const handleModalClose = () => {
    onCloseModal(false);
  };

  const {
    projectId,
    activityId,
    activityName,
    firstName,
    lastName,
    profession,
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
    error: downloadError,
    setErrToNull: downloadSetErrToNull,
    downloadFile: downloadGet,
  } = useAPI();

  const toastId = useRef(null);
  const downloadActivityFile = async () => {
    downloadSetErrToNull();
    try {
      toastId.current = toast.loading("Downloading...");
      await downloadGet(
        `/Activity/pm/DownloadActivityFile?projectId=${projectId}&ActivityId=${activityId}&FileName=${fileName}`,
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
        render: downloadError?.message || "Error Downloading File",
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
        {/* {deleteModal && (
          <CausionModal
            message={`Are you sure you want to delete the file ${fileName}`}
            onCloseModal={() => setDeleteModal(false)}
            handleAction={deleteActivityFile}
          />
        )} */}
        <div className=" flex justify-between items-center flex-wrap  gap-4">
          <h2 className="font-semibold text-2xl">Activity</h2>

          <p className="text-xs md:text-sm lg:text-base">ID: {activityId}</p>
        </div>
        <div className="pm-modal-body">
          <div className="flex justify-between mt-5 flex-wrap gap-3">
            <div className="w-full lg:w-70">
              <FormItemDisplay title={"Name"} value={activityName} />
            </div>
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Status"}
                value={activityStatus[status]}
              />
            </div>
          </div>
          <div className="datesWrapper flex justify-between mt-3 flex-wrap gap-3">
            <div className="w-full sm:w-2.5/5 flex justify-between flex-wrap min-w-fit gap-3 sm:flex-nowrap">
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

            {status != 1 && (
              <>
                <div className="w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-3 sm:flex-nowrap">
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
              </>
            )}
          </div>
          <div className="mt-3">
            <FormItemDisplayBig title={"Description"} value={description} />
          </div>
          <div className="mt-3 w-full  flex sm:justify-between flex-wrap gap-3">
            <div className="w-30 min-w-fit">
              <FormItemDisplay
                title={"Project Phase:"}
                value={constructionPhasesValue[projectPhase]}
              />
            </div>
            <div className="w-30 min-w-fit">
              <FormItemDisplay
                title={"Assigned To:"}
                value={`${firstName} ${lastName}`}
              />
            </div>
            <div className="w-30 min-w-fit">
              <FormItemDisplay
                title={"Profession"}
                value={userProfession[profession]}
              />
            </div>
          </div>
          <div className="mt-3">
            <p className="ml-3 text-xs font-inter ">File Attached</p>
            <div
              style={{ borderColor: "rgb(0,0,0,0.6)" }}
              className="flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base "
            >
              <p>{fileName ? `${fileName}` : "No file"}</p>

              <div>
                {fileName && (
                  <div className="flex max-w-fit justify-end sm:justify-normal">
                    <DownloadBtn OnClick={downloadActivityFile} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </AppModal>
  );
};

export default ClientActivity;
