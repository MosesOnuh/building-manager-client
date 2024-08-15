import React, { useState, useEffect, useRef } from "react";
import GeneralBtn, {ClearBtn} from "../utility/buttons/MainBtns";
import { GetDate } from "../../utils/timeUtil";
import { FaHouse } from "react-icons/fa6";
import GetErrorNotification from "../utility/GetErrorNotification";
import NonFound from "../utility/NonFound";
import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { toast } from "react-toastify";

function ReceivedInvites() {
  // const items = [
  //   {
  //     projectName: "Lekki phase one projects",
  //     userFirstName: "Micheal",
  //     userLastName: "Johnson",
  //     CreatedAt: "2024-05-26 12:27:33.407",
  //   },
  //   {
  //     projectName: "Lekki phase one projects",
  //     userFirstName: "Micheal",
  //     userLastName: "Johnson",
  //     CreatedAt: "2024-05-26 12:27:33.407",
  //   },
  //   {
  //     projectName:
  //       "Lekki phase one projects loremmmmmmmmmmmm mmmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
  //     userFirstName: "Micheal",
  //     userLastName: "Johnson",
  //     CreatedAt: "2024-05-26 12:27:33.407",
  //   },
  //   {
  //     projectName: "Lekki phase one projects",
  //     userFirstName: "Micheal",
  //     userLastName: "Johnson",
  //     CreatedAt: "2024-05-26 12:27:33.407",
  //   },
  // ];

  const [invites, setInvites] = useState([]);
  const [refreshPage, SetRefreshPage] = useState(false);

  const { loading, error, setErrToNull, get } = useAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(`/project/user/GetReceivedProjectInvites`);
        setInvites(response);
        // setInvites(items);

        setErrToNull();
      } catch (err) {
        setInvites(null);
      }
    };

    fetchData();
  }, [refreshPage]);

  const {
    error: inviteAcceptanceError,
    setErrToNull: inviteAcceptanceeqSetErrToNull,
    patch: inviteAcceptanceReq,
  } = useAPI();

  const toastId = useRef(null);
  const handleInviteAcceptance = async (action, ivId, projId) => {
    inviteAcceptanceeqSetErrToNull();
    const reqbody = {
      inviteNotificationId: ivId,
      projectId: projId,
      statusAction: action,
    };

    console.log(reqbody);

    try {
      toastId.current = toast.loading("Loading...");
      await inviteAcceptanceReq(`/Project/user/InviteAcceptance`, reqbody);

      toast.update(toastId.current, {
        render: `${
          action === 2
            ? "Successfully Accepted Project Invite"
            :  action === 3 ? "Successfully Rejected Project Invite" : ""
        }`,
        type: "success",
        isLoading: false,
      });

      SetRefreshPage(!refreshPage);
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    } catch (error) {
      toast.update(toastId.current, {
        render: inviteAcceptanceError?.message || "Error Occurred",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 3000);
    }
  };

  return (
    <>
      <div>
        {loading && <Loader />}
        {error && (
          <div className="sm:my-10">
            <GetErrorNotification message={"Received invites"} />
          </div>
        )}
        {!error && !loading && invites?.length < 1 && (
          // <p>User has no projects</p>
          <NonFound customMessage={"User has no pending invites"} />
        )}
        {!error && !loading && invites?.length > 0 && (
          <>
            <div className="mt-2 sm:mt-4 md:mt-5 bg-gray-400 h-0.5 w-full"></div>
            {invites.map((item) => {
              return (
                <div key={item?.id}>
                  <div className="w-full">
                    <div className="flex items-center gap-5 w-full">
                      <div className="" style={{ minWidth: "30px" }}>
                        <FaHouse style={{ fontSize: "30px" }} />
                      </div>
                      <div
                        class="flex flex-wrap flex-col sm:flex-row sm:justify-between sm:gap-3"
                        style={{ width: "95%", wordWrap: "break-word" }}
                      >
                        <div className="flex  flex-col gap-1 sm:gap-2 py-2 w-full sm:w-3/5">
                          <p className="text-xs sm:text-sm md:text-base lg:text-lg">
                            <strong>{item?.projectName}</strong>
                          </p>
                          <p className="text-xs md:text-sm lg:text-base">
                            <span>
                              <strong>
                                {`${item?.pmFirstName} ${item?.pmLastName} `}
                              </strong>
                            </span>
                            <span>
                              has invited you to become a member of this
                              building project
                            </span>
                          </p>
                          <p className="text-gray-500 text-xxs md:text-xs lg:text-sm  xl:text-base">
                            {`Invited ${GetDate(item?.createdAt)}`}
                          </p>
                        </div>
                        <div className="min-w-fit mb-2 flex items-center">
                          <span className="pr-3">
                            <GeneralBtn
                              OnClick={() => {
                                handleInviteAcceptance(
                                  2,
                                  item?.id,
                                  item?.projectId
                                );
                              }}
                            >
                              Accept
                            </GeneralBtn>
                          </span>

                          <ClearBtn
                            OnClick={() => {
                              handleInviteAcceptance(
                                3,
                                item?.id,
                                item?.projectId
                              );
                            }}
                          >
                            Ignore
                          </ClearBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" bg-gray-400 h-0.5 "></div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default ReceivedInvites;
