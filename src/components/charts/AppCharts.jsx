import React, { useState } from "react";
import ActivityChart from "./activityChart";
// import ActivityChart from './activityChart';
import { PayReqCharts } from "./PayReqCharts";
import { ProjectNavigationBtn } from "../activity/ProjectActivity";
import useMemberInfo from "../../hooks/useMemberInfo";

function AppCharts() {
  const [diplayActivityData, setDiplayActivityData] = useState(true);

  const { user } = useMemberInfo();

  return (
    <>
      <div>
        <div className="flex gap-2 my-5">
          <ProjectNavigationBtn
            bgColor={diplayActivityData}
            OnClick={() => setDiplayActivityData(true)}
          >
            Activities Chart
          </ProjectNavigationBtn>
          <ProjectNavigationBtn
            bgColor={!diplayActivityData}
            OnClick={() => setDiplayActivityData(false)}
          >
            Payment Request Data
          </ProjectNavigationBtn>
        </div>

        {/* {diplayActivityData ? <ActivityChart /> : <LineGraphWeekly />} */}
        {diplayActivityData ? (
          <ActivityChart user={user} />
        ) : (
          <PayReqCharts user={user} />
        )}
      </div>
    </>
  );
}




export default AppCharts;
