import React from "react";
import { formatAmount, userProfession } from "../../../utils/constants";

function PayReqWeeklyDataTable({ items }) {
  return (
    <table className=" w-full overflow-x-auto text-xs md:text-sm lg:text-base">
      <thead>
        <tr className="bg-indigo-700 text-white">
          {/* <th className=" py-2 border-indigo-700 px-1  w-5">S/N</th> */}
          <th className="w-35 border-indigo-700" style={{ minWidth: "180px" }}>
            Profession
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Week 1
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Week 2
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Week 3
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Week 4
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Week 5
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
              {`₦ ${formatAmount(item?.wk1)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.wk2)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.wk3)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.wk4)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.wk5)}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PayReqWeeklyDataTable;
