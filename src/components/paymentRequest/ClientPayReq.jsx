import React, { useEffect, useRef } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../loading/Loading";
import Pagination from "../pagination/Pagination";
import {
  paginationPageSize,
  AddSerialNumber,
  paymentRequestStatus,
  userProfession,
  formatAmount,
} from "../../utils/constants";
import NonFound from "../utility/NonFound";
import GetErrorNotification from "../utility/GetErrorNotification";

import GeneralBtn from "../utility/buttons/MainBtns";
import FormItemDisplay, {
  FormItemDisplayBig,
} from "../utility/FormItemDisplay";
import { format } from "date-fns";
import AppModal from "../utility/Modals/Modal";
import { DownloadBtn } from "../utility/buttons/SmallBtns";
import { toast } from "react-toastify";

import Pm_ClientPayReqTable from "../utility/table/Pm_ClientPayReqTable";
import PayReqItemTable from "../utility/table/PayReqItemTable";
import { SelectInputField } from "../utility/InputFields";

const ClientPayReq = ({ userInfo }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [payReqData, setPayReqData] = useState(null);
  const [viewDetail, setViewDetail] = useState(false);
  const [selectedPayReq, setSelectedPayReq] = useState(null);
  const [refreshPage, SetRefreshPage] = useState(false);
  const [requiredStatus, setRequiredStatus] = useState("");

  const handleChange = (e) => {
    console.log(e.target.value);
    setRequiredStatus(e.target.value);
  };

  const onCloseDetail = (isRefresh) => {
    setSelectedPayReq(null);
    setViewDetail(false);
    if (isRefresh) {
      SetRefreshPage(!refreshPage);
    }
  };

  const displayPayReq = (item) => {
    setSelectedPayReq(item);
    setViewDetail(true);
  };

  const {
    loading: payReqLoading,
    error: payReqError,
    setErrToNull: payReqSetErrToNull,
    get: payReqGet,
  } = useAPI();

  const { projectId } = useParams();

  useEffect(() => {
    let payReqUrl = `/PaymentRequest/PM?projectId=${projectId}&pageNumber=${currentPage}&pageSize=${paginationPageSize}&requiredStatus=${requiredStatus}`;

    const fetchPreConsData = async () => {
      try {
        const response = await payReqGet(payReqUrl);
        setPayReqData(response);
        payReqSetErrToNull();
      } catch (err) {
        setPayReqData(null);
      }
    };

    fetchPreConsData();
  }, [projectId, currentPage, userInfo, refreshPage, requiredStatus]);

  return (
    <>
      <>
        <div>
          <div className="phase-wrapper">
            <div className="w-1/4 min-w-fit mt-3 mb-8">
              <SelectInputField
                InputValue={requiredStatus}
                InputTitle={"Status"}
                InputName={"requiredStatus"}
                OnChange={handleChange}
                selectOptions={[
                  { value: "", text: "All" },
                  { value: "1", text: "Pending" },
                  { value: "2", text: "Awaiting Confirmation" },
                  { value: "3", text: "Confirmed" },
                  { value: "4", text: "Rejected" },
                ]}
              />
            </div>
            <p className="my-3 font-bold text-xs md:text-sm lg:text-base">
              Payment Requests
            </p>
            {payReqLoading && <Loader />}
            {payReqData?.data?.length > 0 && !payReqLoading && !payReqError && (
              <>
                <div
                  style={{ width: "98%" }}
                  className="tableContainer mx-auto mb-3"
                >
                  <Pm_ClientPayReqTable
                    items={AddSerialNumber(
                      payReqData?.data,
                      currentPage,
                      paginationPageSize
                    )}
                    displayPayReq={displayPayReq}
                  />
                </div>
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={payReqData?.pagination?.totalCount}
                  pageSize={paginationPageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
            {payReqData?.data?.length == 0 && !payReqLoading && (
              <div className="sm:my-10">
                <NonFound
                  customMessage={"No Payment Request has been created"}
                />
              </div>
            )}
            {payReqError && !payReqLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  customMessage={payReqError?.message}
                  message={"Payment Requests"}
                />
              </div>
            )}
          </div>
        </div>
      </>

      {viewDetail && (
        <Modal onCloseModal={onCloseDetail} selectedPayReq={selectedPayReq} />
      )}
    </>
  );
};

const Modal = ({ onCloseModal, selectedPayReq }) => {
  const [change, setChange] = useState(false);

  const handleModalClose = () => {
    if (change) {
      onCloseModal(true);
    } else {
      onCloseModal(false);
    }

    onCloseModal();
  };

  // const handlePageRefresh = () => {
  //   setChange(true);
  // };

  return (
    <AppModal onCloseModal={handleModalClose}>
      {selectedPayReq.type === 1 ? (
        <SingleRequestView
          // handlePageRefresh={handlePageRefresh}
          selectedPayReq={selectedPayReq}
        />
      ) : (
        <MultipleRequestView
          // handlePageRefresh={handlePageRefresh}
          selectedPayReq={selectedPayReq}
        />
      )}
    </AppModal>
  );
};

const SingleRequestView = ({ selectedPayReq }) => {
  const [formData, setFormData] = useState({ ...selectedPayReq });
  const [payReqFile, setPayReqFile] = useState(null);
  // const [fileInputDisplay, setFileInputDisplay] = useState(false);
  // const [deleteModal, setDeleteModal] = useState(false);
  // const [fileDelete, setFileDelete] = useState(false);

  // const {
  //   error: addFileError,
  //   setErrToNull: addFileSetErrToNull,
  //   patchFileReq: addFile,
  // } = useAPI();

  // const handlePayReqConfirmation = async (action) => {
  //   payReqConfirmationSetErrToNull();
  //   const reqbody = {
  //     paymentRequestId: formData.paymentRequestId,
  //     projectId: formData.projectId,
  //     statusAction: action,
  //   };

  //   try {
  //     toastId.current = toast.loading("Loading...");
  //     await payReqConfirmationReq(`/PaymentRequest/PM/Confirmation`, reqbody);

  //     setFormData({ ...formData, status: action });

  //     handlePageRefresh();
  //     toast.update(toastId.current, {
  //       render: "Updated Successfully",
  //       type: "success",
  //       isLoading: false,
  //     });
  //     setTimeout(() => {
  //       toast.dismiss();
  //     }, 4000);
  //   } catch (error) {
  //     toast.update(toastId.current, {
  //       render: payReqConfirmationError?.message || "Error Occurred",
  //       type: "error",
  //       isLoading: false,
  //     });
  //     setTimeout(() => {
  //       {
  //         toast.dismiss();
  //       }
  //     }, 4000);
  //   }
  // };

  // const handlePayReqFileDelete = async () => {
  //   deleteSetErrToNull();
  //   try {
  //     toastId.current = toast.loading("Deleting File...");
  //     await deleteFile(
  //       `/PaymentRequest/PM/ConfirmationPaymentRequestFile?projectId=${formData?.projectId}&paymentRequestId=${formData?.paymentRequestId}&fileName=${formData?.pmFileName}`
  //     );

  //     handlePageRefresh();
  //     setFormData({ ...formData, pmFileName: null });
  //     toast.update(toastId.current, {
  //       render: "File Deleted Successfully",
  //       type: "success",
  //       isLoading: false,
  //     });
  //     setDeleteModal(false);
  //     setTimeout(() => {
  //       toast.dismiss();
  //     }, 4000);
  //   } catch (error) {
  //     toast.update(toastId.current, {
  //       render: deleteFileError?.message || "Error Deleting File",
  //       type: "error",
  //       isLoading: false,
  //     });
  //     setTimeout(() => {
  //       {
  //         toast.dismiss();
  //       }
  //     }, 4000);
  //   }
  // };

  // const {
  //   error: payReqConfirmationError,
  //   setErrToNull: payReqConfirmationSetErrToNull,
  //   patch: payReqConfirmationReq,
  // } = useAPI();

  // const {
  //   error: deleteFileError,
  //   setErrToNull: deleteSetErrToNull,
  //   deleteRequest: deleteFile,
  // } = useAPI();

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setPayReqFile(file);
  // };

  // const handleAddPayReqFile = async () => {
  //   addFileSetErrToNull();
  //   try {
  //     const fileData = new FormData();
  //     fileData.append("projectId", formData.projectId);
  //     fileData.append("paymentRequestId", formData.paymentRequestId);
  //     fileData.append("file", payReqFile);

  //     toastId.current = toast.loading("Adding File...");
  //     await addFile(
  //       "/PaymentRequest/PM/AddConfirmationPaymentRequestFile",
  //       fileData
  //     );

  //     handlePageRefresh();
  //     setFormData({ ...formData, pmFileName: payReqFile.name });
  //     setFileInputDisplay(false);

  //     toast.update(toastId.current, {
  //       render: "File Added Successfully",
  //       type: "success",
  //       isLoading: false,
  //     });
  //     setTimeout(() => {
  //       toast.dismiss();
  //     }, 4000);
  //   } catch (error) {
  //     toast.update(toastId.current, {
  //       render: addFileError?.message || "Error Adding File",
  //       type: "error",
  //       isLoading: false,
  //     });
  //     setTimeout(() => {
  //       {
  //         toast.dismiss();
  //       }
  //     }, 4000);
  //   }
  // };

  const {
    error: downloadFileError,
    setErrToNull: downloadSetErrToNull,
    downloadFile: downloadGet,
  } = useAPI();

  const {
    error: downloadConfirmationFileError,
    setErrToNull: downloadConfirmatinFileSetErrToNull,
    downloadFile: downloadGetConfirmationFIle,
  } = useAPI();

  const toastId = useRef(null);
  const handlePayReqFileDownload = async () => {
    downloadSetErrToNull();
    try {
      toastId.current = toast.loading("Downloading...");
      await downloadGet(
        `/PaymentRequest/PM/DownloadPayReqFile?projectId=${formData?.projectId}&paymentRequestId=${formData?.paymentRequestId}&FileName=${formData?.userFileName}`,
        formData?.userFileName
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

  const handleConfirmationPayReqFileDownload = async () => {
    downloadConfirmatinFileSetErrToNull();
    try {
      toastId.current = toast.loading("Downloading...");
      await downloadGetConfirmationFIle(
        `/PaymentRequest/PM/DownloadPayReqConfirmationFilePM?projectId=${formData?.projectId}&paymentRequestId=${formData?.paymentRequestId}&FileName=${formData?.pmFileName}`,
        formData?.pmFileName
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
        render:
          downloadConfirmationFileError?.message || "Error Downloading File",
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
      <div className=" flex justify-between items-center flex-wrap  gap-4">
        <h2 className="font-semibold text-2xl">Payment Request</h2>

        <p className="text-xs md:text-sm lg:text-base">
          ID: {formData?.paymentRequestId}
        </p>
      </div>
      <div className="pm-modal-body">
        <div className="mt-3">
          <FormItemDisplay
            title={"Name"}
            value={formData?.paymentRequestName}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="w-1/4 min-w-fit">
            <FormItemDisplay
              title={"Status"}
              value={paymentRequestStatus[formData?.status]}
            />
          </div>
          <div className="w-1/4 min-w-fit">
            <FormItemDisplay
              title={"Date Requested"}
              value={format(new Date(formData?.createdAt), "yyyy-MM-dd")}
            />
          </div>
          {formData?.status === 3 && (
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Date Confirmed"}
                value={format(new Date(formData?.confirmedAt), "yyyy-MM-dd")}
              />
            </div>
          )}
          {formData?.status === 4 && (
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Date Rejected"}
                value={format(new Date(formData?.confirmedAt), "yyyy-MM-dd")}
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="w-30 min-w-fit">
            <FormItemDisplay
              title={"Assigned To:"}
              value={`${formData?.firstName} ${formData?.lastName}`}
            />
          </div>
          <div className="w-30 min-w-fit">
            <FormItemDisplay
              title={"Profession"}
              value={userProfession[formData?.profession]}
            />
          </div>
        </div>
        <div className="mt-3">
          <FormItemDisplayBig
            title={"Description"}
            value={
              formData?.description ? formData?.description : "No Description"
            }
          />
        </div>

        <div className="mt-3">
          <p className="ml-3 text-xs font-inter ">User File Attached</p>
          <div
            style={{ borderColor: "rgb(0,0,0,0.6)" }}
            className={
              "flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base"
            }
          >
            <p>
              {formData.userFileName ? `${formData.userFileName}` : "No file"}
            </p>
            <div>
              {formData.userFileName && (
                <div className="flex flex-wrap gap-1 max-w-fit justify-end sm:justify-normal">
                  <DownloadBtn OnClick={handlePayReqFileDownload} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="ml-3 text-xs font-inter ">Confirmation File Attached</p>
          <div
            style={{ borderColor: "rgb(0,0,0,0.6)" }}
            className="flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base"
          >
            <p>{formData.pmFileName ? `${formData.pmFileName}` : "No file"}</p>

            <div>
              {formData.pmFileName && (
                <div className="flex flex-wrap gap-1 max-w-fit justify-end sm:justify-normal">
                  <DownloadBtn OnClick={handleConfirmationPayReqFileDownload} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MultipleRequestView = ({ selectedPayReq, handlePageRefresh }) => {
  const [formData, setFormData] = useState({ ...selectedPayReq });
  const [payReqFile, setPayReqFile] = useState(null);
  const [fileInputDisplay, setFileInputDisplay] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileDelete, setFileDelete] = useState(false);

  const {
    error: addFileError,
    setErrToNull: addFileSetErrToNull,
    patchFileReq: addFile,
  } = useAPI();

  const {
    error: downloadFileError,
    setErrToNull: downloadSetErrToNull,
    downloadFile: downloadGet,
  } = useAPI();

  const {
    error: payReqConfirmationError,
    setErrToNull: payReqConfirmationSetErrToNull,
    patch: payReqConfirmationReq,
  } = useAPI();

  const {
    error: downloadConfirmationFileError,
    setErrToNull: downloadConfirmatinFileSetErrToNull,
    downloadFile: downloadGetConfirmationFIle,
  } = useAPI();

  const {
    error: deleteFileError,
    setErrToNull: deleteSetErrToNull,
    deleteRequest: deleteFile,
  } = useAPI();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPayReqFile(file);
  };

  const handleAddPayReqFile = async () => {
    addFileSetErrToNull();
    try {
      const fileData = new FormData();
      fileData.append("projectId", formData.projectId);
      fileData.append("paymentRequestId", formData.paymentRequestId);
      fileData.append("file", payReqFile);

      toastId.current = toast.loading("Adding File...");
      await addFile(
        "/PaymentRequest/PM/AddConfirmationPaymentRequestFile",
        fileData
      );

      handlePageRefresh();
      setFormData({ ...formData, pmFileName: payReqFile.name });
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

  const toastId = useRef(null);
  const handlePayReqFileDownload = async () => {
    downloadSetErrToNull();
    try {
      toastId.current = toast.loading("Downloading...");
      await downloadGet(
        `/PaymentRequest/PM/DownloadPayReqFile?projectId=${formData?.projectId}&paymentRequestId=${formData?.paymentRequestId}&FileName=${formData?.userFileName}`,
        formData?.userFileName
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

  const handleConfirmationPayReqFileDownload = async () => {
    downloadConfirmatinFileSetErrToNull();
    try {
      toastId.current = toast.loading("Downloading...");
      await downloadGetConfirmationFIle(
        `/PaymentRequest/PM/DownloadPayReqConfirmationFilePM?projectId=${formData?.projectId}&paymentRequestId=${formData?.paymentRequestId}&FileName=${formData?.pmFileName}`,
        formData?.pmFileName
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
        render:
          downloadConfirmationFileError?.message || "Error Downloading File",
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

  const handlePayReqConfirmation = async (action) => {
    payReqConfirmationSetErrToNull();
    const reqbody = {
      paymentRequestId: formData.paymentRequestId,
      projectId: formData.projectId,
      statusAction: action,
    };

    try {
      toastId.current = toast.loading("Loading...");
      await payReqConfirmationReq(`/PaymentRequest/PM/Confirmation`, reqbody);

      setFormData({ ...formData, status: action });

      handlePageRefresh();
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
        render: payReqConfirmationError?.message || "Error Occurred",
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

  const handlePayReqFileDelete = async () => {
    deleteSetErrToNull();
    try {
      toastId.current = toast.loading("Deleting File...");
      await deleteFile(
        `/PaymentRequest/PM/ConfirmationPaymentRequestFile?projectId=${formData?.projectId}&paymentRequestId=${formData?.paymentRequestId}&fileName=${formData?.pmFileName}`
      );

      handlePageRefresh();
      setFormData({ ...formData, pmFileName: null });
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

  return (
    <>
      {deleteModal && (
        <CausionModal
          message={
            fileDelete
              ? `Are you sure you want to delete the file ${formData.fileName}`
              : `Are you sure you want to delete the activity with ID: ${formData.paymentRequestId}`
          }
          onCloseModal={() => {
            setFileDelete(false);
            setDeleteModal(false);
          }}
          handleAction={
            fileDelete ? handlePayReqFileDelete : handlePayReqDelete
          }
        />
      )}
      <div className=" flex justify-between items-center flex-wrap  gap-4">
        <h2 className="font-semibold text-2xl">Payment Request</h2>

        <p className="text-xs md:text-sm lg:text-base">
          ID: {formData?.paymentRequestId}
        </p>
      </div>
      <div className="pm-modal-body">
        <div className="mt-3">
          <FormItemDisplay
            title={"Name"}
            value={formData?.paymentRequestName}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="w-1/4 min-w-fit">
            <FormItemDisplay
              title={"Status"}
              value={paymentRequestStatus[formData?.status]}
            />
          </div>
          <div className="w-1/4 min-w-fit">
            <FormItemDisplay
              title={"Date Requested"}
              value={format(new Date(formData?.createdAt), "yyyy-MM-dd")}
            />
          </div>
          {formData?.status === 3 && (
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Date Confirmed"}
                value={format(new Date(formData?.confirmedAt), "yyyy-MM-dd")}
              />
            </div>
          )}
          {formData?.status === 4 && (
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Date Rejected"}
                value={format(new Date(formData?.confirmedAt), "yyyy-MM-dd")}
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="w-30 min-w-fit">
            <FormItemDisplay
              title={"Assigned To:"}
              value={`${formData?.firstName} ${formData?.lastName}`}
            />
          </div>
          <div className="w-30 min-w-fit">
            <FormItemDisplay
              title={"Profession"}
              value={userProfession[formData?.profession]}
            />
          </div>
        </div>
        <div className="mt-3">
          <FormItemDisplayBig
            title={"Description"}
            value={
              formData?.description ? formData?.description : "No Description"
            }
          />
        </div>

        <div className="mt-5">
          <div className="bg-gray-100 py-3">
            {formData?.items?.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <PayReqItemTable
                  items={formData?.items}
                  editable={false}
                  removeItem={false}
                />
              </div>
            )}
          </div>
          <p className="mt-6 text-sm">
            Sum Total Charge:
            {`₦ ${formatAmount(parseFloat(formData?.sumTotalAmount))}`}
          </p>
        </div>

        <div className="mt-6">
          <p className="ml-3 text-xs font-inter ">User File Attached</p>
          <div
            style={{ borderColor: "rgb(0,0,0,0.6)" }}
            className={
              "flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base"
            }
          >
            <p>
              {formData.userFileName ? `${formData.userFileName}` : "No file"}
            </p>
            <div>
              {formData.userFileName && (
                <div className="flex flex-wrap gap-1 max-w-fit justify-end sm:justify-normal">
                  <DownloadBtn OnClick={handlePayReqFileDownload} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="ml-3 text-xs font-inter ">Confirmation File Attached</p>
          <div
            style={{ borderColor: "rgb(0,0,0,0.6)" }}
            className="flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base"
          >
            <p>{formData.pmFileName ? `${formData.pmFileName}` : "No file"}</p>

            <div>
              {formData.pmFileName && (
                <div className="flex flex-wrap gap-1 max-w-fit justify-end sm:justify-normal">
                  <DownloadBtn OnClick={handleConfirmationPayReqFileDownload} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientPayReq;
