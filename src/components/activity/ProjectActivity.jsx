import React from "react";
import OtherProActivity from "./OtherProActivity";
import ClientActivity from "./ClientActivity";
import PmActivity from "./PmActivity";

// import "./ProjectActivity.css"
import useMemberInfo from "../../hooks/useMemberInfo";

const ProjectActivity = () => {
  const { user: memberDetail } = useMemberInfo();

  return (
    <>
        {memberDetail &&
          memberDetail.role === 1 && <PmActivity userInfo={memberDetail} />}
        {memberDetail &&
          memberDetail.role === 2 && (
            <OtherProActivity userInfo={memberDetail} />
          )}
        { memberDetail &&
          memberDetail.role === 3 && <ClientActivity userInfo={memberDetail} />}
    </>
  );
};

export const ProjectNavigationBtn = ({ children, OnClick, bgColor }) => {
  return (
    <>
      <button
      onClick={OnClick}
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
