import React, { useState, useEffect, useRef } from "react";
import GeneralBtn from "../utility/buttons/MainBtns";
import { GetDate, GetDateAndTime } from "../../utils/timeUtil";
import { FaHouse } from "react-icons/fa6";
import GetErrorNotification from "../utility/GetErrorNotification";
import NonFound from "../utility/NonFound";
import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { paginationPageSize, userProfession } from "../../utils/constants";
import Pagination from "../pagination/Pagination";

function SentInvites() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [refreshPage, SetRefreshPage] = useState(false);

  const { loading, error, setErrToNull, get } = useAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(
          `/project/user/GetSentProjectInvites?pageNumber=${currentPage}&pageSize=${paginationPageSize}`
        );
        setData(response);
        console.log(response);
        setErrToNull();
      } catch (err) {
        setData(null);
      }
    };

    fetchData();
  }, [refreshPage, currentPage]);

  return (
    <>
      <div>
        {loading && <Loader />}
        {error && (
          <div className="sm:my-10">
            <GetErrorNotification message={"Received invites"} />
          </div>
        )}
        {!error && !loading && data?.data?.length < 1 && (
          // <p>User has no projects</p>
          <NonFound customMessage={"User has not invited anyone to join a building project"} />
        )}
        {!error && !loading && data?.data?.length > 0 && (
          <>
            <div className="mt-2 sm:mt-4 md:mt-5 bg-gray-400 h-0.5 w-full"></div>
            {data?.data?.map((item) => {
              return (
                <div key={item?.id}>
                  {/* <div className="flex justify-between flex-col sm:flex-row"> */}
                  <div className="w-full">
                    {/* <div className="flex items-center gap-5 w-full bg-blue-100"> */}
                    <div className="flex items-center gap-5 w-full">
                      <div className="" style={{ minWidth: "30px" }}>
                        <FaHouse style={{ fontSize: "30px" }} />
                      </div>
                      <div
                        class="flex flex-wrap flex-col sm:flex-row sm:justify-between sm:gap-3"
                        style={{ width: "95%", wordWrap: "break-word" }}
                      >
                        <div className="flex  flex-col gap-1 sm:gap-2 py-2 w-full sm:w-3/5">
                          <p className="text-xs sm:text-sm md:text-base lg:text-lg w-full">
                            <strong>{item?.projectName}</strong>
                          </p>
                          <p className="text-xs md:text-sm lg:text-base">
                            <span>
                              You have invited
                              <strong>
                                {` ${item?.userFirstName} ${item?.userLastName} `}
                              </strong>
                            </span>
                            <span>
                              {`to join your building project as a ${
                                userProfession[item?.userProfession]
                              }`}
                            </span>
                          </p>
                          <p className="text-gray-500 text-xxs md:text-xs lg:text-sm  xl:text-base">
                            {`Invited ${GetDateAndTime(item?.createdAt)}`}
                          </p>
                        </div>
                        <div className="min-w-fit mb-2 flex flex-col gap-1 sm:gap-2 items-center  justify-center w-10 py-2">
                          <p className="text-xs sm:text-sm md:text-base lg:text-lg">
                            {item?.status === 1 && (
                              <span
                                style={{ color: "rgba(156, 168, 21, 1)" }}
                              >
                                <strong>Pending</strong>
                              </span>
                            )}
                            {item?.status === 2 && (
                              <span style={{ color: "rgba(68, 82, 206, 1)" }}>
                                <strong>Accepted</strong>
                              </span>
                            )}
                            {item?.status === 3 && (
                              <span style={{ color: "rgba(233, 48, 48, 1)" }}>
                                <strong>Rejected</strong>
                              </span>
                            )}
                          </p>
                          {item?.status != 1 && (
                            <p className="text-gray-500 text-xxs md:text-xs lg:text-sm  xl:text-base">{`${GetDateAndTime(
                              item?.updatedAt
                            )}`}</p>
                          )}
                          {item?.status == 1 && (
                            <p className="text-gray-500 text-xxs md:text-xs lg:text-sm  xl:text-base invisible">{`${GetDateAndTime(
                              item?.updatedAt
                            )}`}</p>
                          )}
                          {/* {item?.status === 1 && (
                            <GeneralBtn>Unsend</GeneralBtn>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" bg-gray-400 h-0.5 "></div>
                </div>
              );
            })}
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={data?.pagination?.totalCount}
              pageSize={paginationPageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default SentInvites

