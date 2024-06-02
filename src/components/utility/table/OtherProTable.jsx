import React from "react";
import { GetDate } from "../../../utils/timeUtil";
import { activityStatus } from "../../../utils/constants";

function OtherProTable({ items, displayActivity }) {
  return (
    <table className=" w-full overflow-x-auto text-xs md:text-sm lg:text-base">
      <thead>
        <tr className="bg-indigo-700 text-white">
          <th className=" py-2 border-indigo-700 px-1  w-5">S/N</th>
          <th className="w-35 border-indigo-700" style={{ minWidth: "180px" }}>
            Name
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Start Date
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            End Date
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Actual Start Date
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Actual End Date
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Status
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item, index) => (
          // <tr
          //   key={item.id}
          //   onClick={() => NavigateToActivity(item.id)}
          //   className={`${
          //     index % 2 == 0 ? "bg-white" : "bg-gray-200"
          //   } hover:bg-gray-800 hover:text-white `}
          //   // className="hover:bg-indigo-300 focus:bg-gray:500"
          // >
          <tr
            key={item.id}
            // onClick={() => NavigateToActivity(item.id)}
            className={`${
              index % 2 == 0
                ? "bg-white"
                : "bg-gray-200"
            }  hover:border hover:border-gray-800 `}
            // className="hover:bg-indigo-300 focus:bg-gray:500"
          >
            <td className="w-5 py-2 text-center">{item?.serialNumber}</td>
            <td className="w-35  py-2 pl-3 pr-1 ">{item?.name}</td>
            <td className="w-10  py-2 px-1 text-center">
              {GetDate(item.startDate)}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {GetDate(item?.endDate)}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {item.actualStartDate ? GetDate(item?.actualStartDate) : "No date"}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {item.actualEndDate ? GetDate(item?.actualEndDate) : "No date"}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {activityStatus[item?.status]}
            </td>
            <td
              className="w-10  py-2 px-1 text-center"
              onClick={() => displayActivity(item)}
            >
              <TableBtnPrimary>View Activity</TableBtnPrimary>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OtherProTable;

const TableBtnPrimary = ({ children }) => {
  return (
    <>
      <button className="text-xs bg-blue-100 text-black  py-1 px-2 rounded-lg hover:bg-blue-200 shadow-l">
        {children}
      </button>
    </>
  );
};
