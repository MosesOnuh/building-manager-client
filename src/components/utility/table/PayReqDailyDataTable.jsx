import React from "react";
import { formatAmount, userProfession } from "../../../utils/constants";

function PayReqDailyDataTable({ items}) {
  return (
    <table className=" w-full overflow-x-auto text-xs md:text-sm lg:text-base">
      <thead>
        <tr className="bg-indigo-700 text-white">
          {/* <th className=" py-2 border-indigo-700 px-1  w-5">S/N</th> */}
          <th className="w-35 border-indigo-700" style={{ minWidth: "180px" }}>
            Profession
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Monday
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Tuesday
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Wednesday
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Thursday
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Friday
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Saturday
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Sunday
          </th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item, index) => (
          <tr
            key={item.id}
            className={`${
              index % 2 == 0 ? "bg-white" : "bg-gray-200"
            }  hover:border hover:border-gray-800 `}
          >
            <td className="w-10  py-2 px-1 text-center">
              {userProfession[item?.profession]}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.mon)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.tue)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.wed)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.thu)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.fri)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.sat)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.sun)}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PayReqDailyDataTable;
