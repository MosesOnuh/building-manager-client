import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { useState, useEffect, useRef } from "react";
import Pagination from "../pagination/Pagination";
import "./ProjectIndex.css";
import { ApiDateFormat, GetDate } from "../../utils/timeUtil";
import { useNavigate } from "react-router-dom";
import { AddSerialNumber, paginationPageSize } from "../../utils/constants";
import AppModal from "../utility/Modals/Modal";
import {
  InputField,
  SearchSelect,
  TextAreaField,
} from "../utility/InputFields";
import SubmitBtn from "../utility/buttons/SubmitBtn";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import ProjectTable from "../utility/table/ProjectTable";
import NonFound from "../utility/NonFound";

const ProjectsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [projectItems, setProjectItems] = useState([]);
  const [viewForm, setViewForm] = useState(false);
  const [refreshPage, SetRefreshPage] = useState(false);
  const [countries, setCountries] = useState([]);

  const { loading, error, setErrToNull, get } = useAPI();

  const navigate = useNavigate();

  const NavigateToProject = (projectId) => {
    navigate(`project/${projectId}`);
  };

  const onCloseForm = (isRefresh) => {
    setViewForm(false);
    if (isRefresh) {
      SetRefreshPage(!refreshPage);
    }
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
        setProjectItems([]);
        setData(null);
      }
    };

    fetchData();
  }, [currentPage, refreshPage]);

  return (
    <>
      <div className="pageWrapper mx-4 sm:mx-6 md:mx-10 lg:mx-15 mb-10 mt-5">
        <h2 className="font-extrabold sm:text-lg md:text-2xl mb-10">
          Your Building Projects
        </h2>
        <button
          onClick={() => {
            setViewForm(true);
          }}
          className="mt-3 mb-3 block ml-auto border-2 border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base"
        >
          Create project
        </button>
        {loading && <Loader />}
        {error && (
          <div className="sm:my-10">
            <GetErrorNotification message={"Projects"} />
          </div>
        )}
        {!error && !loading && projectItems?.length < 1 && (
          <NonFound customMessage={"User has no projects"} />
        )}

        {!error && !loading && projectItems.length > 0 && (
          <>
            {/* <p className="my-3 font-bold text-xs md:text-sm lg:text-base">
              Projects
            </p> */}
            {/* <div style={{ width: "98%" }} className="mx-auto mb-3"> */}
            <div
              style={{ width: "98%" }}
              className="mx-auto mb-3 overflow-x-auto"
            >
              <ProjectTable
                items={AddSerialNumber(
                  projectItems,
                  currentPage,
                  paginationPageSize
                )}
                NavigateToProject={NavigateToProject}
              />
            </div>
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={data?.pagination?.totalCount || 3}
              pageSize={paginationPageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
      {viewForm && (
        <CreateProjectModal onCloseModal={onCloseForm} Countries={countries} />
      )}
    </>
  );
};

export default ProjectsPage;

const CreateProjectModal = ({ onCloseModal, Countries }) => {
  const [states, setStates] = useState([]);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: null,
    endDate: null,
    address: "",
    selectedState: null,
    selectedCountry: null,
  });

  const { name, startDate, endDate, address, selectedState, selectedCountry } =
    formData;
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
    post: createProject,
    error: createProjectError,
    setErrToNull: createProjectSetErrToNull,
    loading: createProjLoading,
  } = useAPI();

  const handleFormErrors = async () => {
    setFormError(null);

    if (!name) {
      setFormError("Name must not be empty");
      toast.error("Name must not be empty");
      return true;
    }

    if (!startDate || !endDate) {
      setFormError("Date must not be empty");
      toast.error("Date must not be empty");
      return true;
    }

    // Validate end date is not before start date
    if (new Date(endDate) < new Date(startDate)) {
      setFormError("End date cannot be before start date");
      toast.error("End date cannot be before start date");
      return true;
    }

    if (!address) {
      setFormError("Address must not be empty");
      toast.error("Address must not be empty");
      return true;
    }
    if (!selectedCountry) {
      setFormError("Country must be selected");
      toast.error("Country must be selected");
      return true;
    }

    if (!selectedState) {
      setFormError("State must be selected");
      toast.error("State must be selected");
      return true;
    }

    return false;
  };

  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    createProjectSetErrToNull();

    const errors = await handleFormErrors();
    if (errors) {
      return;
    }

    const reqbody = {
      name: name,
      address: address,
      state: selectedState.value,
      country: selectedCountry.value,
      startDate: ApiDateFormat(startDate),
      endDate: ApiDateFormat(endDate),
    };

    try {
      toastId.current = toast.loading("Loading...");
      await createProject(`/project/user/CreateProject`, reqbody);

      toast.update(toastId.current, {
        render: "Project Created Successfully",
        type: "success",
        isLoading: false,
      });

      setTimeout(() => {
        toast.dismiss();
      }, 4000);

      handleModalClose(true);
    } catch (error) {
      toast.update(toastId.current, {
        render: createProjectError?.message || "Error Occurred",
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

  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      selectedCountry: selectedOption,
      selectedState: null,
    });
    setStates(
      selectedOption.states.map((state) => {
        return { label: state, value: state };
      })
    );
  };

  const handleStateChange = (selectedOption) => {
    setFormData({
      ...formData,
      selectedState: selectedOption,
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
        <h2 className="font-semibold text-2xl">New Project</h2>
        <div className="mt-5">
          <InputField
            InputValue={formData.name}
            InputTitle={"Project Name"}
            InputName={"name"}
            OnChange={handleChange}
          />
        </div>

        <div className="mt-3 w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
          <div className=" w-2.5/5 min-w-fit">
            <InputField
              InputValue={formData.startDate}
              InputTitle={"Start Date (mm-dd-yy)"}
              type="date"
              InputName={"startDate"}
              OnChange={handleChange}
            />
          </div>
          <div className=" w-2.5/5 min-w-fit">
            <InputField
              InputValue={formData.endDate}
              OnChange={handleChange}
              InputTitle={"End Date (mm-dd-yy)"}
              type="date"
              InputName={"endDate"}
            />
          </div>
        </div>

        <div className="mt-3">
          <TextAreaField
            InputValue={formData.address}
            InputTitle={"Address"}
            InputName={"address"}
            OnChange={handleChange}
          />
        </div>
        <div className="mb-10 mt-3 w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap">
          <div className=" w-2.5/5 min-w-fit">
            <SearchSelect
              InputValue={formData.selectedCountry}
              InputTitle={"Country"}
              InputName={"country"}
              OnChange={handleCountryChange}
              selectOptions={Countries}
              customStyles={customStyles}
              Searchable={true}
            />
          </div>
          <div className=" w-2.5/5 min-w-fit">
            <SearchSelect
              InputValue={formData.selectedState}
              InputTitle={"State"}
              InputName={"state"}
              OnChange={handleStateChange}
              selectOptions={states}
              Searchable={true}
              customStyles={customStyles}
            />
          </div>
        </div>
        <div className="ml-auto w-fit">
          <SubmitBtn loading={createProjLoading} />
        </div>
      </form>
    </AppModal>
  );
};
