import React, { useState } from "react";
import { ProjectNavigationBtn } from "../activity/ProjectActivity";
import ReceivedInvites from "./ReceivedInvites";
import SentInvites from "./SentInvites";


function ProjectInvites() {
  const [displayReceived, setDisplayReceived] = useState(true);
  return (
    <>
      <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-15 mb-10 mt-5">
        <h2 className="font-extrabold sm:text-lg md:text-2xl mb-10">
          Your Invites
        </h2>
        <div className="flex gap-2">
          <ProjectNavigationBtn
            bgColor={displayReceived}
            OnClick={() => setDisplayReceived(true)}
          >
            Received
          </ProjectNavigationBtn>
          <ProjectNavigationBtn
            bgColor={!displayReceived}
            OnClick={() => setDisplayReceived(false)}
          >
            Sent
          </ProjectNavigationBtn>
        </div>

        {displayReceived ? <ReceivedInvites /> : <SentInvites />}
      </div>
    </>
  );
}

export default ProjectInvites;
