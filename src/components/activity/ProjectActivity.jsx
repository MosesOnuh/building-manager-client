import React, { useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../loading/Loading";
import OtherProActivity from "./OtherProActivity";
import ClientActivity from "./ClientActivity";
import PmActivity from "./PmActivity";

import "./ProjectActivity.css"
import { userProfession } from "../../utils/constants";
import GetErrorNotification from "../utility/GetErrorNotification";

const ProjectActivity = () => {
  const [memberDetail, setMemberDetail] = useState(null);
  const {
    loading: memberLoading,
    error: memberError,
    setErrToNull: memberSetErrToNull,
    get: memberGet,
  } = useAPI();


  const { projectId } = useParams();

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
                <ProjectNavigationBtn bgColor={"bg-indigo-700"}>
                  Task
                </ProjectNavigationBtn>
                <ProjectNavigationBtn>Insights</ProjectNavigationBtn>
                <ProjectNavigationBtn>Payment Requests</ProjectNavigationBtn>
                <ProjectNavigationBtn>Chat</ProjectNavigationBtn>
              </div>
            </div>
            <div className="mt-2 sm:mt-4 md:mt-5 bg-gray-400 h-0.5 w-full"></div>
          </div>
        )}
        {memberError && !memberLoading && (
          // <GetErrorNotification message={"project information"} />
          <GetErrorNotification customMessage={memberError?.message} />
        )}
        {/* <div className="center">Project Activities</div> */}
        {memberLoading && <Loader />}
        {/* {memberError && (
          <div className="error-alert">
            <p>{memberError?.message}</p>
          </div>
        )} */}
        {!memberLoading &&
          memberDetail &&
          !memberError &&
          memberDetail.role === 1 && <PmActivity userInfo={memberDetail} />}
        {!memberLoading &&
          memberDetail &&
          !memberError &&
          memberDetail.role === 2 && (
            <OtherProActivity userInfo={memberDetail} />
          )}
        {!memberLoading &&
          memberDetail &&
          !memberError &&
          memberDetail.role === 3 && <ClientActivity userInfo={memberDetail} />}
      </div>
    </>
  );     
};

export const ProjectNavigationBtn = ({ children, bgColor }) => {
  return (
    <>
      <button
        className={` ${
          bgColor ? "bg-black text-white" : "bg-gray-200"
        } w-fit border-gray-200 text-black h-fit py-1 px-3 sm:px-4 rounded-lg hover:bg-blue-200 shadow-l text-xs md:text-sm lg:text-base`}
      >
        {children}
      </button>
    </>
  );
};

export default ProjectActivity;
