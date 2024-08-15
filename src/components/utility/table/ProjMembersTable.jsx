import React, { useState } from "react";
import { GetDate } from "../../../utils/timeUtil";
import { memberProjectAccess, userProfession } from "../../../utils/constants";
import GeneralBtn, { ClearBtn } from "../buttons/MainBtns";
import Loader from "../../loading/Loading";
import { DeleteBtn, SmallDefaultBtn } from "../buttons/SmallBtns";
import { ClipLoader } from "react-spinners";

function ProjMembersTable({ items, handleBlock, blockLoading, user }) {
  // const [members, setMembers] = useState([...items]);
  const [members, setMembers] = useState(items);
  const [userBlockId, setUserBlockId] = useState("");

  const handleMemberBlock = async (member, action) => {
    setUserBlockId(member?.userId);
    const bool = await handleBlock(member?.userId, action);
    setUserBlockId("");
    if (bool) {
      let newMember = { ...member, userAccess: action };
      let newMembers = [...members];
      let memberIndex = newMembers.findIndex(
        (v) => v?.userId == member?.userId
      );
      newMembers[memberIndex] = newMember;
      setMembers(newMembers);
    }
  };
  return (
    <table className=" w-full overflow-x-auto text-xs md:text-sm lg:text-base">
      <thead>
        <tr className="bg-indigo-700 text-white">
          <th className=" py-2 border-indigo-700 px-1  w-5">S/N</th>
          <th className="w-35 border-indigo-700" style={{ minWidth: "180px" }}>
            Name
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Profession
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Email
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Phone Number
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Joined At
          </th>
          {user?.role === 1 && (
            <th
              className="w-10  border-indigo-700"
              style={{ minWidth: "68px" }}
            >
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {members?.map((item, index) => (
          <tr
            key={item.id}
            className={`${
              index % 2 == 0 ? "bg-white" : "bg-gray-200"
            }  hover:border hover:border-gray-800 `}
            // className="hover:bg-indigo-300 focus:bg-gray:500"
          >
            <td className="w-5 py-2 text-center">{1 + index++}</td>
            <td className="w-35  py-2 pl-3 pr-1 ">{`${item?.firstName} ${
              item?.lastName
            } ${item?.projOwner === 1 ? "(Project Owner)" : ""}`}</td>
            <td className="w-10  py-2 px-1 text-center">
              {userProfession[item?.profession]}
            </td>
            <td className="w-10  py-2 px-1 text-center">{item?.email}</td>
            <td className="w-10  py-2 px-1 text-center">{item?.phoneNumber}</td>
            <td className="w-10  py-2 px-1 text-center">
              {GetDate(item?.createdAt)}
            </td>
            {/* {user?.role === 1 && user?.userId !== item?.userId ? (
              <td className="w-10  py-2 px-1 text-center">
                {item?.userAccess === 1 && !blockLoading ? (
                  <DeleteBtn
                    OnClick={() =>
                      handleMemberBlock(item, memberProjectAccess.block)
                    }
                  >
                    {blockLoading ? <ClipLoader /> : "Block"}
                  </DeleteBtn>
                ) : (
                  <SmallDefaultBtn
                    OnClick={() =>
                      handleMemberBlock(item, memberProjectAccess.unBlock)
                    }
                  >
                    {blockLoading && item?.userId == userBlockId ? (
                      <ClipLoader />
                    ) : (
                      "UnBlock"
                    )}
                  </SmallDefaultBtn>
                )}
              </td>
            ) : ( 
              <td></td>
            )} */}

            {user?.role === 1 && user?.userId !== item?.userId && (
              <td className="w-10  py-2 px-1 text-center">
                {item?.userAccess === 1 && item?.userId !== userBlockId && (
                  <>
                    <DeleteBtn
                      OnClick={() =>
                        handleMemberBlock(item, memberProjectAccess.block)
                      }
                    >
                      Block
                    </DeleteBtn>
                  </>
                )}
                {item?.userAccess === 2 && item?.userId !== userBlockId && (
                  <>
                    <SmallDefaultBtn
                      OnClick={() =>
                        handleMemberBlock(item, memberProjectAccess.unBlock)
                      }
                    >
                      UnBlock
                    </SmallDefaultBtn>
                  </>
                )}
                {blockLoading && item?.userId == userBlockId && <ClipLoader />}
              </td>
            )}

            {user?.role === 1 && user?.userId == item?.userId && <td></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProjMembersTable;
