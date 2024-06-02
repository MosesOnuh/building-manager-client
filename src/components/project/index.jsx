import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom"
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
    navigate(`activities/chart`);
    // /project/:projectId
  };


  const NavigateToActivities= () => {
    navigate("");
    // /project/:projectId
  };

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
  return (
    <>
      <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-15 mb-10">
        {memberDetail && !memberLoading && !memberError && (
          <div className="mb-3">
            <div className=" flex justify-between mt-2 flex-wrap gap-4">
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
                <ProjectNavigationBtn
                  OnClick={NavigateToActivities}
                  bgColor={"bg-indigo-700"}
                >
                  Task
                </ProjectNavigationBtn>
                <ProjectNavigationBtn>Insights</ProjectNavigationBtn>
                <ProjectNavigationBtn>Payment Requests</ProjectNavigationBtn>
                <ProjectNavigationBtn OnClick={NavigateToChart}>
                  Chart
                </ProjectNavigationBtn>
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
}

export default ProjectsWrapper;