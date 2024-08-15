import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import GetErrorNotification from "../utility/GetErrorNotification";
import useMemberInfo from "../../hooks/useMemberInfo";
import { userProfession } from "../../utils/constants";
import { ProjectNavigationBtn } from "../activity/ProjectActivity";

const ProjectsWrapper = () => {
  // const [memberDetail, setMemberDetail] = useState(null);
  const {
    loading: memberLoading,
    error: memberError,
    setErrToNull: memberSetErrToNull,
    get: memberGet,
  } = useAPI();

  const { user: memberDetail, setUser: setMemberDetail } = useMemberInfo();

  const { projectId } = useParams();
  const navigate = useNavigate();
  const NavigateToChart = () => {
    navigate("activities/chart");
  };
  const NavigateToInfo = () => {
    navigate("info");
  };

  const NavigateToActivities = () => {
    navigate("");
    // /project/:projectId
  };

  const location = useLocation();
  var afterTaskUrl = location.pathname.split("/")[4];

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        const memberResponse = await memberGet(
          `/Project/user/GetProjMemberDetails/${projectId}`
        );
        setMemberDetail(memberResponse?.data);
        console.log(memberResponse);
        memberSetErrToNull();
      } catch (err) {
        setMemberDetail(null);
      }
    };

    fetchMemberDetail();
  }, [projectId]);

  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-black text-white w-fit border-gray-200  h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base"
      : "bg-gray-200 w-fit border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base";


   const linkStyleTask = ({ isActive, param }) =>
     (isActive && !param)
       ? "bg-black text-white w-fit border-gray-200  h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-baseg"
       : "bg-gray-200 w-fit border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base";

  return (
    <>
      <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-15 mb-10">
        {memberDetail && !memberLoading && !memberError && (
          <div className="my-5">
            <div className=" flex justify-between flex-wrap gap-4">
              <div className=" w-full sm:w-4/5  lg:w-2/4">
                <p className="font-extrabold sm:text-lg md:text-2xl">
                  {`${memberDetail?.projectName}` || ""}
                </p>
                <p className="font-semibold text-xs md:text-sm lg:text-base">{`${
                  memberDetail?.firstName || ""
                }  ${memberDetail?.lastName || ""}`}</p>
                <p className="font-semibold text-xs md:text-sm lg:text-base">
                  {`${userProfession[memberDetail?.profession]} ${
                    memberDetail?.profession === 2 ? "(Admin)" : ""
                  }` || ""}
                </p>
              </div>
              <div className="w-fit flex gap-2 sm:gap:3 lg:items-end flex-wrap ">
                <NavLink
                  to=""
                  className={() =>
                    linkStyleTask({ isActive: true, param: afterTaskUrl })
                  }
                >
                  Task
                </NavLink>
                <NavLink to="paymentRequest" className={linkStyle}>
                  Payment Requests
                </NavLink>
                <NavLink to="activities/chart" className={linkStyle}>
                  Chart
                </NavLink>
                <NavLink to="info" className={linkStyle}>
                  Info
                </NavLink>
                <NavLink to="chatMessage" className={linkStyle}>
                  Chat Message
                </NavLink>
                {/* <ProjectNavigationBtn OnClick={NavigateToInfo}>
                  Info
                </ProjectNavigationBtn> */}
              </div>
            </div>
            <div className="mt-2 sm:mt-4 md:mt-5 bg-gray-400 h-0.5 w-full"></div>
          </div>
        )}
        {memberLoading && <Loader />}
        {memberError && !memberLoading && (
          <GetErrorNotification customMessage={memberError?.message} />
        )}
        {memberDetail && <Outlet />}
      </div>
    </>
  );
};

export default ProjectsWrapper;
