import React, { useRef, useState, useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import AppModal from "../utility/Modals/Modal";
import {
  InputField,
  SearchSelect,
  TextAreaField,
  // TextAreaField,
} from "../utility/InputFields";
import SubmitBtn from "../utility/buttons/SubmitBtn";
import { toast } from "react-toastify";
import { ProjectProfessionals } from "../../utils/constants";
import useMemberInfo from "../../hooks/useMemberInfo";
import Loader from "../loading/Loading";
import GetErrorNotification from "../utility/GetErrorNotification";
import FormItemDisplay, {
  FormItemDisplayBig,
} from "../utility/FormItemDisplay";
import { ApiDateFormat, GetDate } from "../../utils/timeUtil";
import GeneralBtn, { ClearBtn } from "../utility/buttons/MainBtns";
import { Country, State } from "country-state-city";
import { format } from "date-fns";
import ProjMembersTable from "../utility/table/ProjMembersTable";
import NonFound from "../utility/NonFound";

function ProjectInfo() {
  const [viewForm, setViewForm] = useState(false);
  const [refreshPage, SetRefreshPage] = useState(false);
  const [projData, setProjData] = useState({
    id: "",
    name: "",
    address: "",
    startDate: "",
    endDate: "",
    country: "",
    state: "",
  });

  const [getData, setGetData] = useState(false);

  const [backupProjData, setBackupProjData] = useState(null);

  const [editProj, setEditProj] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [members, setMembers] = useState(null);

  const { user } = useMemberInfo();
  let projectId = user?.projectId;
  let role = user?.role;

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

  const handleChange = (e) => {
    setProjData({ ...projData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = () => {
    const countryOptions = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.name,
      states: State.getStatesOfCountry(country.isoCode).map(
        (state) => state.name
      ),
    }));

    setCountries(countryOptions);
  };

  const editProject = () => {
    handleCountryChange(
      countries?.find((item) => item.label == projData?.country)
    );
    handleStateChange({ label: state, value: state });
    setEditProj(true);
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setStates(
      selectedOption.states.map((state) => {
        return { label: state, value: state };
      })
    );
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const {
    loading: projMembersLoading,
    error: projMembersError,
    setErrToNull: projMembersSetErrToNull,
    get: getProjMembers,
  } = useAPI();

  const {
    loading: projDataLoading,
    error: projDataError,
    setErrToNull: projDataSetErrToNull,
    get: getProjData,
  } = useAPI();

  const {
    loading: memberBlockLoading,
    error: memberBlockError,
    setErrToNull: memberBlockSetErrToNull,
    patch: memberBlockReq,
  } = useAPI();

  const {
    // loading: projUpdateLoading,
    error: projUpdateError,
    setErrToNull: projUpdateSetErrToNull,
    put: projUpdate,
  } = useAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjData(
          `/project/user/GetProject/${projectId}`
        );
        setGetData(true);
        setProjData({
          ...response?.data,
          startDate: format(new Date(response?.data?.startDate), "yyyy-MM-dd"),
          endDate: format(new Date(response?.data?.endDate), "yyyy-MM-dd"),
        });
        setBackupProjData({
          ...response?.data,
          startDate: format(new Date(response?.data?.startDate), "yyyy-MM-dd"),
          endDate: format(new Date(response?.data?.endDate), "yyyy-MM-dd"),
        });
        projDataSetErrToNull();
      } catch (err) {
        // setProjData(null);
        setGetData(false);
        setProjData({
          id: "",
          name: "",
          address: "",
          startDate: "",
          endDate: "",
          country: "",
          state: "",
        });
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjMembers(
          `/Project/user/ProjectMembers/${projectId}`
        );
        setMembers(response?.data);
        projMembersSetErrToNull();
      } catch (err) {
        setMembers(null);
        // console.log("get project error");
        // console.log(err)
      }
    };

    fetchData();
  }, [projectId]);

  // const { id, name, address, startDate, endDate } = projData;
  const { id, name, address, startDate, endDate, country, state } = projData;

  const toastId = useRef(null);

  const handleProjectUpdate = async () => {
    projUpdateSetErrToNull();
    const reqbody = {
      id: id,
      name,
      address,
      state: selectedState?.value,
      country: selectedCountry?.value,
      startDate: ApiDateFormat(startDate),
      endDate: ApiDateFormat(endDate),
    };

    try {
      toastId.current = toast.loading("Loading...");
      await projUpdate(`/Project/PM/UpdateProject`, reqbody);
      setProjData({
        ...projData,
        country: selectedCountry.value,
        state: selectedState.value,
      });
      setEditProj(false);
      // setActivityChange(true);
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
        render: projUpdateError?.message || "Error Occurred",
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

  const handleMemberBlock = async (userId, action) => {
    memberBlockSetErrToNull();
    const reqbody = {
      projectId,
      userId: userId,
      statusAction: action,
    };

    try {
      toastId.current = toast.loading("Loading...");
      await memberBlockReq(`/Project/PM/UserAccess`, reqbody);

      toast.update(toastId.current, {
        render: `Member ${action === 2 ? "Blocked" : "UnBlocked"} Successfully`,
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 4000);
      return true;
    } catch (error) {
      toast.update(toastId.current, {
        render: memberBlockError?.message || "Error Occurred",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 4000);

      return false;
    }
  };

  const onCloseForm = (isRefresh) => {
    setViewForm(false);
    if (isRefresh) {
      SetRefreshPage(!refreshPage);
    }
  };

  const removeEdit = () => {
    setEditProj(false);
    setProjData({ ...backupProjData });
  };
  return (
    <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-15 mb-10 ">
      {/* <h2>project info</h2> */}

      {user && (user.role === 1 || user.role === 3) && (
        <>
          <button
            onClick={() => {
              setViewForm(true);
            }}
            className="mt-3 block ml-auto border-2 border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base"
          >
            Invite Professional
          </button>
          {viewForm && <ProjectInviteModal onCloseModal={onCloseForm} />}
        </>
      )}

      <div className="project-info-section">
        <h2 className="mt-5 sm:text-lg md:text-xl mb-3">Project Information</h2>
        {projDataLoading && <Loader />}
        {projDataError && (
          <div className="sm:my-10">
            <GetErrorNotification
              customMessage={projDataError?.message}
              message={"Project"}
            />
          </div>
        )}

        {getData && !projDataError && !projDataLoading && (
          <div className="Project-Info lg:w-3/5">
            {editProj && role == 1 ? (
              <InputField
                InputValue={name}
                InputTitle={"Name"}
                InputName={"name"}
                OnChange={handleChange}
                editMode={editProj}
              />
            ) : (
              <FormItemDisplay title={"Name"} value={name} />
            )}

            {editProj && role == 1 ? (
              <div className="mt-3 w-full sm:w-2.5/5 flex  justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                <div className="w-2.5/5 min-w-fit">
                  <InputField
                    InputValue={startDate}
                    InputTitle={"Start Date (mm-dd-yy)"}
                    type="date"
                    InputName={"startDate"}
                    OnChange={handleChange}
                    editMode={editProj}
                  />
                </div>
                <div className="w-2.5/5 min-w-fit">
                  <InputField
                    InputValue={endDate}
                    OnChange={handleChange}
                    InputTitle={"End Date (mm-dd-yy)"}
                    type="date"
                    InputName={"endDate"}
                    editMode={editProj}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-3 w-full sm:w-2.5/5 flex justify-between flex-wrap min-w-fit gap-4 sm:flex-nowrap">
                <div className="w-2.5/5 min-w-fit">
                  <FormItemDisplay
                    title={"Start Date"}
                    value={startDate ? GetDate(startDate) : "No date"}
                    // Style={"min-w-fit"}
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

            <div className="mt-3">
              {editProj && role == 1 ? (
                <TextAreaField
                  InputValue={address}
                  InputTitle={"Address"}
                  InputName={"address"}
                  OnChange={handleChange}
                  editMode={editProj}
                />
              ) : (
                <FormItemDisplayBig title={"Address"} value={address} />
              )}
            </div>
            {/* <div className="mb-10 mt-3 w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap"> */}
            {editProj && role == 1 ? (
              <div className="mt-3 w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                <div className=" w-2.5/5 min-w-fit">
                  <SearchSelect
                    InputValue={selectedCountry}
                    InputTitle={"Country"}
                    InputName={"country"}
                    OnChange={handleCountryChange}
                    selectOptions={countries}
                    customStyles={customStyles}
                    Searchable={true}
                  />
                </div>
                <div className=" w-2.5/5 min-w-fit">
                  <SearchSelect
                    InputValue={selectedState}
                    InputTitle={"State"}
                    InputName={"state"}
                    OnChange={handleStateChange}
                    selectOptions={states}
                    Searchable={true}
                    customStyles={customStyles}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-3 w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
                <div className="w-2.5/5 min-w-fit">
                  <FormItemDisplay title={"Country"} value={country} />
                </div>
                <div className="w-2.5/5 min-w-fit">
                  <FormItemDisplay title={"State"} value={state} />
                </div>
              </div>
            )}

            <div className="mt-8">
              {role == 1 && (
                <>
                  {editProj ? (
                    <div className="flex gap-4 ">
                      <GeneralBtn OnClick={handleProjectUpdate}>
                        Submit
                      </GeneralBtn>
                      <ClearBtn OnClick={removeEdit}> Cancel</ClearBtn>
                    </div>
                  ) : (
                    <GeneralBtn OnClick={editProject}>Edit</GeneralBtn>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="project-members-section mt-10">
        <h2 className=" sm:text-lg md:text-xl mb-3">Project Members</h2>
        {projMembersLoading && <Loader />}
        {projMembersError && (
          <div className="sm:my-10">
            <GetErrorNotification
              customMessage={projMembersError?.message}
              message={"Project members"}
            />
          </div>
        )}
        {!projMembersError && !projMembersLoading && members?.length < 1 && (
          <NonFound customMessage={"No member has joined this project"} />
        )}

        {!projMembersError && !projMembersLoading && members?.length > 0 && (
          <div
            style={{ width: "98%" }}
            className="mx-auto mb-3 overflow-x-auto"
          >
            <ProjMembersTable
              items={members}
              handleBlock={handleMemberBlock}
              blockLoading={memberBlockLoading}
              user={user}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const ProjectInviteModal = ({ onCloseModal, Countries }) => {
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    selectedProfession: null,
  });

  const { email, selectedProfession } = formData;
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

  const { user } = useMemberInfo();
  let projectId = user?.projectId;

  const {
    post: ProjectInvite,
    error: projectInviteError,
    setErrToNull: projectInviteSetErrToNull,
    loading: projectInviteLoading,
  } = useAPI();

  const handleFormErrors = async () => {
    setFormError(null);

    if (!email) {
      setFormError("Email must not be empty");
      toast.error("Email must not be empty");
      return true;
    }

    if (!selectedProfession) {
      setFormError("Profession must be selected");
      toast.error("Profession must be selected");
      return true;
    }

    return false;
  };

  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    projectInviteSetErrToNull();

    const errors = await handleFormErrors();
    if (errors) {
      return;
    }

    const reqbody = {
      projectId,
      email,
      profession: selectedProfession.value,
    };

    try {
      toastId.current = toast.loading("Loading...");
      await ProjectInvite(`/project/PM/ProjectMemberInvite`, reqbody);
      //   Project / PM / ProjectMemberInvite;

      toast.update(toastId.current, {
        render: "Project Invite Sent Successfully",
        type: "success",
        isLoading: false,
      });

      setTimeout(() => {
        toast.dismiss();
      }, 4000);

      handleModalClose(true);
    } catch (err) {
      toast.update(toastId.current, {
        render: projectInviteError?.message || "Error Occurred",
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

  const handleProfessionChange = (selectedOption) => {
    setFormData({
      ...formData,
      selectedProfession: selectedOption,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = (change) => {
    if (change) {
      onCloseModal(true);
    } else {
      onCloseModal(false);
    }
  };

  return (
    <AppModal onCloseModal={() => handleModalClose(false)}>
      <form onSubmit={handleSubmit}>
        <h2 className="font-semibold text-2xl">Add Member to Project</h2>
        <div className="mt-5">
          <InputField
            InputValue={formData.email}
            InputTitle={"Email"}
            InputName={"email"}
            OnChange={handleChange}
          />
        </div>

        {/* <div className="mb-10 mt-3 w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap"> */}
        <div className=" w-2.5/5 min-w-fit mb-10 mt-3">
          <SearchSelect
            InputValue={formData.selectedProfession}
            InputTitle={"Profession"}
            InputName={"profession"}
            OnChange={handleProfessionChange}
            selectOptions={ProjectProfessionals}
            customStyles={customStyles}
            className="react-select"
            Searchable={true}
          />
        </div>
        {/* </div> */}
        <div className="ml-auto w-fit">
          <SubmitBtn loading={projectInviteLoading} />
        </div>
      </form>
    </AppModal>
  );
};

export default ProjectInfo;
