import React, { useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../loading/Loading";
// import { paginationPageSize, userProfession } from "../../utils/constants";
// import Pagination from "../pagination/Pagination";
// import { GetDate } from "../../utils/timeUtil";
import OtherProActivity from "./OtherProActivity";
import ClientActivity from "./ClientActivity";
import PmActivity from "./PmActivity";

import "./ProjectActivity.css"

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
      <div className="center">Project Activities</div>
      {memberLoading && <Loader />}
      {memberError && (
        <div className="error-alert">
          <p>{memberError?.message}</p>
        </div>
      )}
      {!memberLoading &&
        memberDetail &&
        !memberError &&
        memberDetail.role === 1 && <PmActivity userInfo={memberDetail} />}
      {!memberLoading &&
        memberDetail &&
        !memberError &&
        memberDetail.role === 2 && <OtherProActivity userInfo={memberDetail} />}
      {!memberLoading &&
        memberDetail &&
        !memberError &&
        memberDetail.role === 3 && (
          <ClientActivity userInfo={memberDetail} />
        )}
    </>
  );     
};

export default ProjectActivity;
