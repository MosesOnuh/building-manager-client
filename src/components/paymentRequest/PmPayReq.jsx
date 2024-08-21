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
  addNairaKobo,
  calculateTotalByMultiplication,
} from "../../utils/constants";
import NonFound from "../utility/NonFound";
import GetErrorNotification from "../utility/GetErrorNotification";
import GeneralBtn, { ClearBtn } from "../utility/buttons/MainBtns";
import FormItemDisplay, {
  FormItemDisplayBig,
} from "../utility/FormItemDisplay";
import { format } from "date-fns";
import AppModal from "../utility/Modals/Modal";
import {
  SmallDefaultBtn,
  DeleteBtn,
  DownloadBtn,
} from "../utility/buttons/SmallBtns";
import { toast } from "react-toastify";
import CausionModal from "../utility/Modals/CausionModal";
import Pm_ClientPayReqTable from "../utility/table/Pm_ClientPayReqTable";
import PayReqItemTable, {
  PayReqItemTableEditable,
} from "../utility/table/PayReqItemTable";
import {
  DefaultSelect,
  InputField,
  SearchSelect,
  SelectInputField,
  TextAreaField,
} from "../utility/InputFields";
import { ProjectNavigationBtn } from "../activity/ProjectActivity";
import SubmitBtn from "../utility/buttons/SubmitBtn";
import { FaPlus } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

const PmPayReq = ({ userInfo }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [payReqData, setPayReqData] = useState(null);
  const [viewForm, setViewForm] = useState(false);
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

  const closeForm = (isRefresh) => {
    setViewForm(false);
    if (isRefresh) {
      SetRefreshPage(!refreshPage);
    }
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
      <button
        onClick={() => {
          setViewForm(true);
        }}
        className="mt-3 block ml-auto border-2 border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base"
      >
        Create Payment Request
      </button>

      <>
        {/* <div> */}
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
                { value: "5", text: "Done" },
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
                customMessage={
                  requiredStatus
                    ? "No Payment Request based on filter criteria"
                    : "No Payment Request has been created"
                }
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
        {/* </div> */}

        {viewForm && (
          <CreatePaymentRequestModal onClose={closeForm} userInfo={userInfo} />
        )}
      </>
      {viewDetail && (
        <Modal
          onCloseModal={onCloseDetail}
          selectedPayReq={selectedPayReq}
          userInfo={userInfo}
        />
      )}
    </>
  );
};

const CreatePaymentRequestModal = ({ onClose, userInfo }) => {
  const [displaySinglePayReq, setDisplaySinglePayReq] = useState(true);
  const [members, setMembers] = useState(null);
  // const [assignedMember, setAssignedMember] = useState(null);
  const projectId = userInfo?.projectId;
  const {
    loading: projMembersLoading,
    error: projMembersError,
    setErrToNull: projMembersSetErrToNull,
    get: getProjMembers,
  } = useAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjMembers(
          `/Project/user/ProjectMembers/${projectId}`
        );

        let newMembers = response?.data
          // ?.filter((v) => v.userAccess == 1 && v.role != 3)
          ?.filter(
            (v) =>
              (v.userAccess == 1 && v.role === 2) ||
              (v.userAccess == 1 &&
                v.role === 1 &&
                v.userId == userInfo?.userId)
          )
          .map((v) => {
            return {
              label: `${v.firstName} ${v.lastName} (${
                userProfession[v.profession]
              })`,
              value: `${v.userId}`,
            };
          });
        // console.log(newMembers);
        setMembers(newMembers);
        projMembersSetErrToNull();
      } catch (err) {
        setMembers(null);
      }
    };

    fetchData();
  }, [projectId]);

  const handleModalClose = (change) => {
    if (change) {
      onClose(true);
    } else {
      onClose(false);
    }

    onClose();
  };
  return (
    // <AppModal onCloseModal={() => handleModalClose()}>
    <AppModal onCloseModal={handleModalClose}>
      <h2 className="font-semibold text-2xl mb-5">Create Payment Request</h2>
      {projMembersLoading && !projMembersError && <Loader />}
      {projMembersError && (
        <div className="sm:my-10">
          <GetErrorNotification
            customMessage={projMembersError?.message}
            message={"Data"}
          />
        </div>
      )}
      {!projMembersLoading && !projMembersError && members && (
        <>
          <div className="flex gap-2 mb-5">
            <ProjectNavigationBtn
              bgColor={displaySinglePayReq}
              OnClick={() => setDisplaySinglePayReq(true)}
            >
              Single
            </ProjectNavigationBtn>
            <ProjectNavigationBtn
              bgColor={!displaySinglePayReq}
              OnClick={() => setDisplaySinglePayReq(false)}
            >
              Group
            </ProjectNavigationBtn>
          </div>
          {displaySinglePayReq ? (
            <SinglePaymentReq
              projectId={projectId}
              onClose={handleModalClose}
              members={members}
            />
          ) : (
            <MultiplePaymentReq
              projectId={projectId}
              onClose={handleModalClose}
              members={members}
            />
          )}
        </>
      )}
    </AppModal>
  );
};

const SinglePaymentReq = ({ projectId, onClose, members }) => {
  // const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sumTotalAmount: "",
    assignedMember: null,
  });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid black",
      borderRadius: "8px",
      fontSize: "13px",
      // outline: "none"
      // "&:focus": {
      //   borderColor: "black",
      // },
      // minHeight: "2rem", // Reduce the min height
      // height: "2rem",
      // padding: "0", // Ensure no padding
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const { name, description, sumTotalAmount, assignedMember } = formData;

  const {
    post: createPayReq,
    error: payReqError,
    setErrToNull: payReqSetErrToNull,
    loading: payReqLoading,
  } = useAPI();

  const handleFormErrors = async () => {
    if (!name) {
      toast.error("Name must not be empty");
      return true;
    }

    if (!sumTotalAmount) {
      toast.error("Amount must not be empty");
      return true;
    }

    if (isNaN(parseFloat(sumTotalAmount))) {
      toast.error("Amount must be a number");
      return true;
    }

    if (!assignedMember) {
      toast.error("A Owner must be selected");
      return true;
    }

    return false;
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, assignedMember: selectedOption });
  };

  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    payReqSetErrToNull();

    const errors = await handleFormErrors();
    if (errors) {
      return;
    }

    const reqbody = {
      projectId,
      type: 1,
      name: name?.trim(),
      description: description ? description.trim() : null,
      items: [],
      sumTotalAmount: parseFloat(sumTotalAmount),
      assignedTo: assignedMember.value,
    };

    try {
      toastId.current = toast.loading("Loading...");
      await createPayReq(`/PaymentRequest/PM`, reqbody);

      toast.update(toastId.current, {
        render: "Payment Request created Successfully",
        type: "success",
        isLoading: false,
      });

      setTimeout(() => {
        toast.dismiss();
      }, 4000);

      onClose(true);
    } catch (err) {
      toast.update(toastId.current, {
        render: payReqError?.message || "Error Occurred",
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

  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Check if the value is a number or empty
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-5">
        <InputField
          InputValue={name}
          InputTitle={"Name"}
          InputName={"name"}
          OnChange={handleNameChange}
          maximumLength={200}
        />
      </div>
      <div className="mt-5">
        <TextAreaField
          InputValue={description}
          InputTitle={"Description"}
          InputName={"description"}
          OnChange={handleDescriptionChange}
          maximumLength={500}
        />
      </div>
      <div className="mt-5">
        <InputField
          InputValue={sumTotalAmount}
          InputTitle={"Amount (₦)"}
          InputName={"sumTotalAmount"}
          OnChange={handleAmountChange}
          PlaceHolder={"0.00"}
        />
      </div>
      <div className=" w-2.5/5 min-w-fit mt-3">
        <SearchSelect
          InputValue={formData.assignedMember}
          InputTitle={"Owner"}
          InputName={"assignedMember"}
          OnChange={handleSelectChange}
          selectOptions={members}
          customStyles={customStyles}
          // className="react-select"
          Searchable={true}
        />
      </div>

      <div className="mt-8">
        <SubmitBtn loading={payReqLoading} />
      </div>
    </form>
  );
};

const MultiplePaymentReq = ({ projectId, onClose, members }) => {
  // const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sumTotalAmount: "",
    items: [],
    assignedMember: null,
  });

  const [item, setItem] = useState({
    id: "",
    name: "",
    price: "",
    quantity: "",
    totalAmount: 0,
  });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid black",
      borderRadius: "8px",
      fontSize: "13px",
      // outline: "none"
      // "&:focus": {
      //   borderColor: "black",
      // },
      // minHeight: "2rem", // Reduce the min height
      // height: "2rem",
      // padding: "0", // Ensure no padding
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  useEffect(() => {
    setItem({
      ...item,
      totalAmount: isNaN(parseFloat(item.price) * parseFloat(item.quantity))
        ? 0
        : calculateTotalByMultiplication(
            parseFloat(item.price),
            parseFloat(item.quantity)
          ),
    });

    let sumTotal = addNairaKobo(formData.items.map((v) => v.totalAmount));

    setFormData((prevState) => {
      return { ...prevState, sumTotalAmount: sumTotal };
    });
  }, [item.price, item.quantity]);

  useEffect(() => {
    let sumTotal = addNairaKobo(formData.items.map((v) => v.totalAmount));
    setFormData((prevState) => {
      return { ...prevState, sumTotalAmount: sumTotal };
    });
  }, [formData.items]);

  const handleRemoveItem = (current) => {
    let oldItems = [...formData?.items];
    let newItems = oldItems.filter((v) => v.id != current.id);

    setFormData((prevState) => {
      return { ...prevState, items: newItems };
    });
  };

  const handleAddItem = () => {
    if (!item.name) {
      toast.error("Item/Service Name must not be empty");
      return;
    }

    if (!item.price) {
      toast.error("Item/Service Price must not be empty");
      return;
    }

    if (!item.quantity) {
      toast.error("Item/Service Quantity must not be empty");
      return;
    }

    setFormData((prevState) => {
      return {
        ...prevState,
        items: [...prevState.items, { ...item, id: uuidv4() }],
      };
    });
    setItem({
      id: "",
      name: "",
      price: "",
      quantity: "",
      totalAmount: 0,
    });

    console.log(formData.items);
  };

  const handleDecimalChange = (e) => {
    const value = e.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setItem({ ...item, [e.target.name]: value });
    } else {
      return;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleItemChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const { name, description, items, sumTotalAmount } = formData;

  const {
    post: createPayReq,
    error: payReqError,
    setErrToNull: payReqSetErrToNull,
    loading: payReqLoading,
  } = useAPI();

  const handleFormErrors = async () => {
    // setFormError(null);

    if (!name) {
      // setFormError("Name must not be empty");
      toast.error("Name must not be empty");
      return true;
    }

    if (items?.length < 1) {
      // setFormError("items/service must not be empty");
      toast.error("items/service must not be empty");
      return true;
    }

    if (parseFloat(sumTotalAmount) < 1) {
      // setFormError("Sum Total Amount must not be empty");
      toast.error("Sum Total Amount must not be empty");
      return true;
    }

    if (!formData.assignedMember) {
      // setFormError("Amount must not be empty");
      toast.error("A Owner must be selected");
      return true;
    }

    return false;
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, assignedMember: selectedOption });
  };

  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    payReqSetErrToNull();

    const errors = await handleFormErrors();
    if (errors) {
      return;
    }

    const reqbody = {
      projectId,
      type: 2,
      name: name?.trim(),
      description: description ? description.trim() : null,
      items: items.map((v) => {
        return {
          projectId,
          name: v.name,
          price: v.price,
          quantity: v.quantity,
          totalAmount: v.totalAmount,
        };
      }),
      sumTotalAmount: sumTotalAmount,
      assignedTo: formData.assignedMember.value,
    };

    try {
      toastId.current = toast.loading("Loading...");
      await createPayReq(`/PaymentRequest/PM`, reqbody);

      toast.update(toastId.current, {
        render: "Payment Request created Successfully",
        type: "success",
        isLoading: false,
      });

      setTimeout(() => {
        toast.dismiss();
      }, 4000);

      onClose(true);
    } catch (err) {
      toast.update(toastId.current, {
        render: payReqError?.message || "An error occurred. Try again",
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
    <form onSubmit={handleSubmit}>
      <div className="mt-5">
        <InputField
          InputValue={name}
          InputTitle={"Name"}
          InputName={"name"}
          OnChange={handleNameChange}
          maximumLength={200}
        />
      </div>
      <div className="mt-5">
        <TextAreaField
          InputValue={description}
          InputTitle={"Description"}
          InputName={"description"}
          OnChange={handleDescriptionChange}
          maximumLength={500}
        />
      </div>
      <div className="mt-5">
        <div className="bg-gray-300 py-3 rounded-lg">
          <p className="text-center pb-5"> Add service/Item</p>
          <div className="w-4/5 flex  justify-between min-w-fit flex-wrap gap-4">
            <div className="w-full xs:w-2.5/5 min-w-fit">
              <InputField
                InputValue={item.name}
                InputTitle={"Service/Item Name"}
                type="text"
                InputName={"name"}
                OnChange={handleItemChange}
              />
            </div>
            <div className="w-full xs:w-2.5/5 min-w-fit">
              <InputField
                InputValue={item.price}
                OnChange={handleDecimalChange}
                InputTitle={"Price (₦)"}
                type="text"
                InputName={"price"}
                PlaceHolder={"0.00"}
              />
            </div>
            <div className="w-full xs:w-2.5/5 min-w-fit">
              <InputField
                InputValue={parseFloat(item.quantity)}
                OnChange={handleDecimalChange}
                InputTitle={"Quantity"}
                type="number"
                InputName={"quantity"}
                PlaceHolder={"0.00"}
              />
            </div>
            <div className="w-full xs:w-2.5/5 min-w-fit">
              <FormItemDisplay
                title={"Total Amount (₦)"}
                value={formatAmount(parseFloat(item.totalAmount))}
                Style={"bg-white"}
              />
            </div>
          </div>
          <div></div>
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-green-200 p-2 rounded-3xl mt-5 block ml-auto"
          >
            <FaPlus style={{ fontSize: "20px" }} />
          </button>
          {formData?.items?.length > 0 && (
            <>
              <p className="text-center"> Service/Item List</p>
              <div className="mt-5 overflow-x-auto">
                <PayReqItemTableEditable
                  items={formData?.items}
                  removeItem={handleRemoveItem}
                  removeAction={true}
                  editable={true}
                />
              </div>
            </>
          )}
        </div>
        <p className="mt-6 text-sm">
          Sum Total Charge:
          {`₦ ${formatAmount(parseFloat(sumTotalAmount))}`}
        </p>
      </div>
      <div className=" w-2.5/5 min-w-fit mt-8">
        <SearchSelect
          InputValue={formData.assignedMember}
          InputTitle={"Owner"}
          InputName={"assignedMember"}
          OnChange={handleSelectChange}
          selectOptions={members}
          customStyles={customStyles}
          // className="react-select"
          Searchable={true}
        />
      </div>

      {/* <div className="ml-auto w-fit"> */}
      <div className="mt-8">
        <SubmitBtn loading={payReqLoading} />
      </div>
    </form>
  );
};

const Modal = ({ onCloseModal, selectedPayReq, userInfo }) => {
  const [change, setChange] = useState(false);
  const [members, setMembers] = useState(null);
  const projectId = userInfo?.projectId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjMembers(
          `/Project/user/ProjectMembers/${projectId}`
        );

        //remove hardcoded value
        let newMembers = response?.data
          ?.filter(
            (v) =>
              (v.userAccess == 1 && v.role === 2) ||
              (v.userAccess == 1 &&
                v.role === 1 &&
                v.userId == userInfo?.userId)
          )
          .map((v) => {
            return {
              label: `${v.firstName} ${v.lastName} (${
                userProfession[v.profession]
              })`,
              value: `${v.userId}`,
              role: v.role,
            };
          });
        console.log(newMembers);
        setMembers(newMembers);
        projMembersSetErrToNull();
      } catch (err) {
        setMembers(null);
      }
    };

    fetchData();
  }, [projectId]);

  const {
    loading: projMembersLoading,
    error: projMembersError,
    setErrToNull: projMembersSetErrToNull,
    get: getProjMembers,
  } = useAPI();

  const handleModalClose = (passedChange = false) => {
    if (change || passedChange) {
      onCloseModal(true);
    } else {
      onCloseModal(false);
    }

    onCloseModal();
  };

  const handlePageRefresh = () => {
    setChange(true);
  };

  return (
    <AppModal onCloseModal={handleModalClose}>
      {projMembersLoading && !projMembersError && <Loader />}
      {projMembersError && (
        <div className="sm:my-10">
          <GetErrorNotification
            customMessage={projMembersError?.message}
            message={"Data"}
          />
        </div>
      )}
      {!projMembersLoading && !projMembersError && members && (
        <>
          {selectedPayReq.type === 1 ? (
            <SingleRequestView
              handlePageRefresh={handlePageRefresh}
              selectedPayReq={selectedPayReq}
              userInfo={userInfo}
              members={members}
              handleModalClose={handleModalClose}
            />
          ) : (
            <MultipleRequestView
              handlePageRefresh={handlePageRefresh}
              selectedPayReq={selectedPayReq}
              userInfo={userInfo}
              members={members}
              handleModalClose={handleModalClose}
            />
          )}
        </>
      )}
    </AppModal>
  );
};

const SingleRequestView = ({
  selectedPayReq,
  handlePageRefresh,
  userInfo,
  members,
  handleModalClose,
}) => {
  const [editPayReq, setEditPayReq] = useState(false);
  const [formData, setFormData] = useState({
    ...selectedPayReq,
    assignedMember: members.find((v) => v.value === selectedPayReq.userId),
  });
  // const [payReqFileOtherPro, setPayReqFileOtherPro] = useState(null);
  const [payReqFile, setPayReqFile] = useState(null);
  const [fileInputDisplay, setFileInputDisplay] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileDelete, setFileDelete] = useState(false);

  const maxSizeInMB = 300; // Maximum file size in MB
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to Bytes

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid black",
      borderRadius: "8px",
      fontSize: "13px",
      // outline: "none"
      // "&:focus": {
      //   borderColor: "black",
      // },
      // minHeight: "2rem", // Reduce the min height
      // height: "2rem",
      // padding: "0", // Ensure no padding
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

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

  const {
    error: payReqUpdateError,
    setErrToNull: payReqUpdateSetErrToNull,
    patch: payReqUpdateReq,
  } = useAPI();

  const {
    error: deletePayReqError,
    setErrToNull: deletePayReqSetErrToNull,
    deleteRequest: deletePayReq,
  } = useAPI();

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

    setPayReqFile(file);
  };

  const handleAddPayReqFile = async () => {
    addFileSetErrToNull();

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (payReqFile?.type && !allowedTypes.includes(payReqFile?.type)) {
      toast.error("Only word, pdf, and image files are allowed.");
      return;
    }

    if (payReqFile?.size > maxSizeInBytes) {
      toast.error(
        `File size exceeds the ${maxSizeInMB}MB limit. Please upload a smaller file.`
      );
      return;
    }

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

  const handlePayReqDelete = async () => {
    deletePayReqSetErrToNull();
    try {
      toastId.current = toast.loading("Loading...");
      await deletePayReq(
        `/PaymentRequest/PM/${formData?.projectId}/${formData?.paymentRequestId}`
      );

      toast.update(toastId.current, {
        render: "Payment Request Deleted Successfully",
        type: "success",
        isLoading: false,
      });

      // handlePageRefresh();
      setFormData(null);
      handleModalClose(true);

      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: deletePayReqError?.message || "Error Deleting Payment Request",
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

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, assignedMember: selectedOption });
  };

  const handleFormErrors = async () => {
    if (!formData.paymentRequestName) {
      toast.error("Name must not be empty");
      return true;
    }

    if (!formData.sumTotalAmount) {
      toast.error("Amount must not be empty");
      return true;
    }

    if (isNaN(parseFloat(formData.sumTotalAmount))) {
      toast.error("Amount must be a number");
      return true;
    }

    if (!formData.assignedMember) {
      toast.error("A Owner must be selected");
      return true;
    }

    return false;
  };

  const handlePayReqUpdate = async () => {
    payReqUpdateSetErrToNull();

    const errors = await handleFormErrors();
    if (errors) {
      return;
    }

    const reqbody = {
      id: formData.paymentRequestId,
      projectId: formData.projectId,
      name: formData.paymentRequestName?.trim(),
      description: formData.description?.trim(),
      sumTotalAmount: formData.sumTotalAmount,
      assignedTo: formData.assignedMember.value,
    };
    try {
      toastId.current = toast.loading("Loading...");
      await payReqUpdateReq(`/PaymentRequest/PM/SinglePaymentRequest`, reqbody);
      setFormData({
        ...formData,
        userId: reqbody.assignedTo,
        status:
          members.filter((v) => v.value == reqbody.assignedTo)[0].role == 1
            ? 2
            : 1,
      });
      setEditPayReq(false);
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
        render: payReqUpdateError?.message || "Error Occurred",
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

  const removeEdit = () => {
    setEditPayReq(false);
    setFormData({ ...selectedPayReq });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Check if the value is a number or empty
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      return;
    }
  };

  return (
    <>
      {deleteModal && (
        <CausionModal
          message={
            fileDelete
              ? `Are you sure you want to delete the file ${formData.fileName}`
              : `Are you sure you want to delete the Payment Request with ID: ${formData.paymentRequestId}`
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
          {editPayReq &&
          userInfo.userId === formData?.userId &&
          formData.status === 2 ? (
            <InputField
              InputValue={formData?.paymentRequestName}
              InputTitle={"Name"}
              InputName={"paymentRequestName"}
              OnChange={handleNameChange}
              editMode={editPayReq}
              maximumLength={200}
            />
          ) : (
            <FormItemDisplay
              title={"Name"}
              value={formData?.paymentRequestName}
            />
          )}
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
                value={
                  formData?.confirmedAt
                    ? format(new Date(formData?.confirmedAt), "yyyy-MM-dd")
                    : "No date"
                }
              />
            </div>
          )}
          {formData?.status === 4 && (
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Date Rejected"}
                value={
                  formData?.confirmedAt
                    ? format(new Date(formData?.confirmedAt), "yyyy-MM-dd")
                    : "No date"
                }
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="w-30 min-w-fit">
            {editPayReq &&
            userInfo.userId === formData?.userId &&
            formData.status === 2 ? (
              <SearchSelect
                InputValue={formData.assignedMember}
                InputTitle={"Owner"}
                InputName={"assignedMember"}
                OnChange={handleSelectChange}
                selectOptions={members}
                customStyles={customStyles}
                // className="react-select"
                Searchable={true}
              />
            ) : (
              <FormItemDisplay
                title={"Assigned To:"}
                value={`${formData?.firstName} ${formData?.lastName}`}
              />
            )}
          </div>
          <div className="w-30 min-w-fit">
            <FormItemDisplay
              title={"Profession"}
              value={userProfession[formData?.profession]}
            />
          </div>
        </div>
        <div className="mt-3">
          {editPayReq &&
          userInfo.userId === formData?.userId &&
          formData.status === 2 ? (
            <TextAreaField
              InputValue={formData?.description}
              InputTitle={"Description"}
              InputName={"description"}
              OnChange={handleDescriptionChange}
              editMode={editPayReq}
              maximumLength={500}
            />
          ) : (
            <FormItemDisplayBig
              title={"Description"}
              value={
                formData?.description ? formData?.description : "No Description"
              }
            />
          )}
        </div>

        <div className="mt-3">
          {editPayReq &&
          userInfo.userId === formData?.userId &&
          formData.status === 2 ? (
            <InputField
              InputValue={formData?.sumTotalAmount}
              InputTitle={"Amount (₦)"}
              InputName={"sumTotalAmount"}
              OnChange={handleAmountChange}
              PlaceHolder={"0.00"}
              editMode={editPayReq}
            />
          ) : (
            <FormItemDisplayBig
              title={"Amount (₦)"}
              value={formData?.sumTotalAmount}
            />
          )}
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
            className={` ${
              fileInputDisplay
                ? "!border-indigo-400 focus:!border-indigo-700 focus:!outline-none"
                : ""
            }flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base `}
          >
            {fileInputDisplay ? (
              <input type="file" onChange={handleFileChange} />
            ) : (
              <p>
                {formData.pmFileName ? `${formData.pmFileName}` : "No file"}
              </p>
            )}
            <div>
              {formData.pmFileName && (
                <div className="flex flex-wrap gap-1 max-w-fit justify-end sm:justify-normal">
                  <DownloadBtn OnClick={handleConfirmationPayReqFileDownload} />
                  {formData.status === 2 && (
                    <DeleteBtn
                      OnClick={() => {
                        setFileDelete(true);
                        setDeleteModal(true);
                      }}
                    />
                  )}
                </div>
              )}
              {!formData.pmFileName &&
                formData.status === 2 &&
                !fileInputDisplay && (
                  <SmallDefaultBtn OnClick={() => setFileInputDisplay(true)}>
                    Add File
                  </SmallDefaultBtn>
                )}
              {!formData.pmFileName &&
                formData.status === 2 &&
                fileInputDisplay &&
                payReqFile && (
                  <SmallDefaultBtn OnClick={handleAddPayReqFile}>
                    Save File
                  </SmallDefaultBtn>
                )}
            </div>
          </div>
        </div>

        {/* <div className="flex gap-2 mt-3"> */}
        <div className="flex gap-2 mt-8">
          {!editPayReq && formData?.status === 2 && (
            <>
              <GeneralBtn OnClick={() => handlePayReqConfirmation(3)}>
                Confirm
              </GeneralBtn>
              <GeneralBtn OnClick={() => handlePayReqConfirmation(4)}>
                Reject
              </GeneralBtn>
            </>
          )}

          {userInfo?.userId === formData?.userId && formData.status === 2 && (
            <>
              {editPayReq ? (
                <>
                  <GeneralBtn OnClick={handlePayReqUpdate}>Submit</GeneralBtn>
                  <ClearBtn OnClick={removeEdit}>Cancel</ClearBtn>
                </>
              ) : (
                <GeneralBtn OnClick={() => setEditPayReq(true)}>
                  Edit
                </GeneralBtn>
              )}
            </>
          )}

          {!editPayReq &&
            userInfo?.userId === formData?.userId &&
            (formData.status === 2 || formData.status === 4) && (
              <ClearBtn OnClick={() => setDeleteModal(true)}> Delete</ClearBtn>
            )}
        </div>
      </div>
    </>
  );
};

const MultipleRequestView = ({
  selectedPayReq,
  handlePageRefresh,
  userInfo,
  members,
  handleModalClose,
}) => {
  const [editPayReq, setEditPayReq] = useState(false);
  const [formData, setFormData] = useState({
    ...selectedPayReq,
    assignedMember: members.find((v) => v.value === selectedPayReq.userId),
  });
  const [payReqFile, setPayReqFile] = useState(null);
  const [fileInputDisplay, setFileInputDisplay] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileDelete, setFileDelete] = useState(false);
  const [deletedItems, setDeletedItems] = useState([]);
  const [item, setItem] = useState({
    projectId: selectedPayReq.projectId,
    paymentRequestId: selectedPayReq.paymentRequestId,
    id: "",
    name: "",
    price: "",
    quantity: "",
    totalAmount: 0,
  });

  const maxSizeInMB = 300; // Maximum file size in MB
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to Bytes

  useEffect(() => {
    setItem({
      ...item,
      totalAmount: isNaN(parseFloat(item.price) * parseFloat(item.quantity))
        ? 0
        : calculateTotalByMultiplication(
            parseFloat(item.price),
            parseFloat(item.quantity)
          ),
    });

    let sumTotal = addNairaKobo(formData.items.map((v) => v.totalAmount));

    setFormData((prevState) => {
      return { ...prevState, sumTotalAmount: sumTotal };
    });
  }, [item.price, item.quantity]);

  useEffect(() => {
    let sumTotal = addNairaKobo(formData.items.map((v) => v.totalAmount));
    setFormData((prevState) => {
      return { ...prevState, sumTotalAmount: sumTotal };
    });
  }, [formData.items]);

  const handleRemoveItem = (current) => {
    let oldItems = [...formData?.items];
    let itemDeleted = oldItems.find((v) => v.id === current.id);
    setDeletedItems((prevState) => {
      return [...prevState, itemDeleted];
    });
    console.log("Deleted Items", deletedItems);
    let newItems = oldItems.filter((v) => v.id != current.id);

    setFormData((prevState) => {
      return { ...prevState, items: newItems };
    });
  };

  const handleAddItem = () => {
    if (!item.name) {
      toast.error("Item/Service Name must not be empty");
      return;
    }

    if (!item.price) {
      toast.error("Item/Service Price must not be empty");
      return;
    }

    if (!item.quantity) {
      toast.error("Item/Service Quantity must not be empty");
      return;
    }

    setFormData((prevState) => {
      return {
        ...prevState,
        items: [...prevState.items, { ...item, id: uuidv4() }],
      };
    });
    setItem({
      id: "",
      name: "",
      price: "",
      quantity: "",
      totalAmount: 0,
    });

    // console.log(formData.items);
  };

  const handleDecimalChange = (e) => {
    const value = e.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setItem({ ...item, [e.target.name]: value });
    } else {
      return;
    }
  };

  const handleItemChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid black",
      borderRadius: "8px",
      fontSize: "13px",
      // outline: "none"
      // "&:focus": {
      //   borderColor: "black",
      // },
      // minHeight: "2rem", // Reduce the min height
      // height: "2rem",
      // padding: "0", // Ensure no padding
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

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
    error: payReqUpdateError,
    setErrToNull: payReqUpdateSetErrToNull,
    patch: payReqUpdateReq,
  } = useAPI();

  const {
    error: deleteFileError,
    setErrToNull: deleteSetErrToNull,
    deleteRequest: deleteFile,
  } = useAPI();

  const {
    error: deletePayReqError,
    setErrToNull: deletePayReqSetErrToNull,
    deleteRequest: deletePayReq,
  } = useAPI();

  const removeEdit = () => {
    setEditPayReq(false);
    setFormData({ ...selectedPayReq });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    setPayReqFile(file);
  };

  const handleAddPayReqFile = async () => {
    addFileSetErrToNull();

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (payReqFile?.type && !allowedTypes.includes(payReqFile?.type)) {
      // setFormError("Only word, pdf, and image files are allowed.");
      toast.error("Only word, pdf, and image files are allowed.");
      return;
    }

    if (payReqFile?.size > maxSizeInBytes) {
      toast.error(
        `File size exceeds the ${maxSizeInMB}MB limit. Please upload a smaller file.`
      );
      return;
    }

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

  const handlePayReqDelete = async () => {
    deletePayReqSetErrToNull();
    try {
      toastId.current = toast.loading("Loading...");
      await deletePayReq(
        `/PaymentRequest/PM/${formData?.projectId}/${formData?.paymentRequestId}`
      );

      toast.update(toastId.current, {
        render: "Payment Request Deleted Successfully",
        type: "success",
        isLoading: false,
      });

      // handlePageRefresh();
      setFormData(null);
      handleModalClose(true);

      setTimeout(() => {
        toast.dismiss();
      }, 4000);
    } catch (error) {
      toast.update(toastId.current, {
        render: deletePayReqError?.message || "Error Deleting Payment Request",
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
      toastId.current = toast.loading("LDeleting File...");
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

  //new total change
  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, assignedMember: selectedOption });
  };

  const handleFormErrors = async () => {
    if (!formData.paymentRequestName) {
      toast.error("Name must not be empty");
      return true;
    }

    if (!formData.sumTotalAmount) {
      toast.error("Amount must not be empty");
      return true;
    }

    if (isNaN(parseFloat(formData.sumTotalAmount))) {
      toast.error("Amount must be a number");
      return true;
    }

    if (!formData.assignedMember) {
      toast.error("A Owner must be selected");
      return true;
    }

    return false;
  };

  const handlePayReqUpdate = async () => {
    payReqUpdateSetErrToNull();
    const errors = await handleFormErrors();
    if (errors) {
      return;
    }

    //items: formData.items,
    const reqbody = {
      id: formData.paymentRequestId,
      projectId: formData.projectId,
      name: formData.paymentRequestName?.trim(),
      description: formData.description?.trim(),
      items: formData.items.map((v) => {
        return {
          projectId: userInfo?.projectId,
          paymentRequestId: formData.paymentRequestId,
          ...v,
        };
      }),
      deletedItems: deletedItems.map((v) => {
        return {
          projectId: userInfo?.projectId,
          paymentRequestId: formData.paymentRequestId,
          ...v,
        };
      }),
      sumTotalAmount: formData.sumTotalAmount,
      assignedTo: formData.assignedMember.value,
    };
    try {
      toastId.current = toast.loading("Loading...");
      await payReqUpdateReq(`PaymentRequest/PM/GroupPaymentRequest`, reqbody);
      setFormData({
        ...formData,
        userId: reqbody.assignedTo,
        status:
          members.filter((v) => v.value == reqbody.assignedTo)[0].role == 1
            ? 2
            : 1,
      });

      setEditPayReq(false);
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
        render: payReqUpdateError?.message || "Error Occurred",
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
          {editPayReq &&
          userInfo.userId === formData?.userId &&
          formData.status === 2 ? (
            <InputField
              InputValue={formData?.paymentRequestName}
              InputTitle={"Name"}
              InputName={"paymentRequestName"}
              OnChange={handleNameChange}
              editMode={editPayReq}
              maximumLength={200}
            />
          ) : (
            <FormItemDisplay
              title={"Name"}
              value={formData?.paymentRequestName}
            />
          )}
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
                value={
                  formData?.confirmedAt
                    ? format(new Date(formData?.confirmedAt), "yyyy-MM-dd")
                    : "No date"
                }
              />
            </div>
          )}
          {formData?.status === 4 && (
            <div className="w-1/4 min-w-fit">
              <FormItemDisplay
                title={"Date Rejected"}
                value={formData?.confirmedAt ? format(new Date(formData?.confirmedAt), "yyyy-MM-dd") : "No date"}
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="w-30 min-w-fit">
            {editPayReq &&
            userInfo.userId === formData?.userId &&
            formData.status === 2 ? (
              <SearchSelect
                InputValue={formData.assignedMember}
                InputTitle={"Owner"}
                InputName={"assignedMember"}
                OnChange={handleSelectChange}
                selectOptions={members}
                customStyles={customStyles}
                // className="react-select"
                Searchable={true}
              />
            ) : (
              <FormItemDisplay
                title={"Assigned To:"}
                value={`${formData?.firstName} ${formData?.lastName}`}
              />
            )}
          </div>
          <div className="w-30 min-w-fit">
            <FormItemDisplay
              title={"Profession"}
              value={userProfession[formData?.profession]}
            />
          </div>
        </div>
        <div className="mt-3">
          {editPayReq &&
          userInfo.userId === formData?.userId &&
          formData.status === 2 ? (
            <TextAreaField
              InputValue={formData?.description}
              InputTitle={"Description"}
              InputName={"description"}
              OnChange={handleDescriptionChange}
              editMode={editPayReq}
              maximumLength={500}
            />
          ) : (
            <FormItemDisplayBig
              title={"Description"}
              value={
                formData?.description ? formData?.description : "No Description"
              }
            />
          )}
        </div>

        <div className="mt-5">
          <div className={`${editPayReq && "bg-gray-300 rounded-lg"} py-3`}>
            {editPayReq && (
              <div>
                <p className="text-center pb-5"> Add service/Item</p>
                <div className="w-4/5 flex  justify-between min-w-fit flex-wrap gap-4">
                  <div className="w-full xs:w-2.5/5 min-w-fit">
                    <InputField
                      InputValue={item.name}
                      InputTitle={"Service/Item Name"}
                      type="text"
                      InputName={"name"}
                      OnChange={handleItemChange}
                    />
                  </div>
                  <div className="w-full xs:w-2.5/5 min-w-fit">
                    <InputField
                      InputValue={item.price}
                      OnChange={handleDecimalChange}
                      InputTitle={"Price (₦)"}
                      type="text"
                      InputName={"price"}
                      PlaceHolder={"0.00"}
                    />
                  </div>
                  <div className="w-full xs:w-2.5/5 min-w-fit">
                    <InputField
                      InputValue={parseFloat(item.quantity)}
                      OnChange={handleDecimalChange}
                      InputTitle={"Quantity"}
                      type="number"
                      InputName={"quantity"}
                      PlaceHolder={"0.00"}
                    />
                  </div>
                  <div className="w-full xs:w-2.5/5 min-w-fit">
                    <FormItemDisplay
                      title={"Total Amount (₦)"}
                      value={formatAmount(parseFloat(item.totalAmount))}
                      Style={"bg-white"}
                    />
                  </div>
                </div>
                {/* <div></div> */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-green-200 p-2 rounded-3xl mt-5 block ml-auto"
                >
                  <FaPlus style={{ fontSize: "20px" }} />
                </button>
              </div>
            )}

            {formData?.items?.length > 0 && (
              <>
                <p className="text-center"> Service/Item List</p>{" "}
                <div className="mt-5 overflow-x-auto">
                  <PayReqItemTableEditable
                    items={formData?.items}
                    editable={editPayReq}
                    removeItem={handleRemoveItem}
                  />
                </div>
              </>
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
            className={` ${
              fileInputDisplay
                ? "!border-indigo-400 focus:!border-indigo-700 focus:!outline-none"
                : ""
            }flex justify-between rounded-lg py-1 px-1 md:px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 text-xs md:text-sm lg:text-base `}
          >
            {fileInputDisplay ? (
              <input type="file" onChange={handleFileChange} />
            ) : (
              <p>
                {formData.pmFileName ? `${formData.pmFileName}` : "No file"}
              </p>
            )}
            <div>
              {formData.pmFileName && (
                <div className="flex flex-wrap gap-1 max-w-fit justify-end sm:justify-normal">
                  <DownloadBtn OnClick={handleConfirmationPayReqFileDownload} />
                  {formData.status === 2 && (
                    <DeleteBtn
                      OnClick={() => {
                        setFileDelete(true);
                        setDeleteModal(true);
                      }}
                    />
                  )}
                </div>
              )}
              {!formData.pmFileName &&
                formData.status === 2 &&
                !fileInputDisplay && (
                  <SmallDefaultBtn OnClick={() => setFileInputDisplay(true)}>
                    Add File
                  </SmallDefaultBtn>
                )}
              {!formData.pmFileName &&
                formData.status === 2 &&
                fileInputDisplay &&
                payReqFile && (
                  <SmallDefaultBtn OnClick={handleAddPayReqFile}>
                    Save File
                  </SmallDefaultBtn>
                )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-8">
          {!editPayReq && formData?.status === 2 && (
            <>
              <GeneralBtn OnClick={() => handlePayReqConfirmation(3)}>
                Confirm
              </GeneralBtn>

              <GeneralBtn OnClick={() => handlePayReqConfirmation(4)}>
                Reject
              </GeneralBtn>
            </>
          )}

          {userInfo?.userId === formData?.userId && formData.status === 2 && (
            <>
              {editPayReq ? (
                <>
                  <GeneralBtn OnClick={handlePayReqUpdate}>Submit</GeneralBtn>
                  <ClearBtn OnClick={removeEdit}>Cancel</ClearBtn>
                </>
              ) : (
                <GeneralBtn OnClick={() => setEditPayReq(true)}>
                  Edit
                </GeneralBtn>
              )}
            </>
          )}

          {!editPayReq &&
            userInfo?.userId === formData?.userId &&
            (formData.status === 2 || formData.status === 4) && (
              <ClearBtn OnClick={() => setDeleteModal(true)}> Delete</ClearBtn>
            )}
        </div>
      </div>
    </>
  );
};

export default PmPayReq;
