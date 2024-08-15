import React from "react";
import { formatAmount, userProfession } from "../../../utils/constants";

function PayReqMonthlyDataTable({ items }) {
  return (
    <table className=" w-full overflow-x-auto text-xs md:text-sm lg:text-base">
      <thead>
        <tr className="bg-indigo-700 text-white">
          {/* <th className=" py-2 border-indigo-700 px-1  w-5">S/N</th> */}
          <th className="w-35 border-indigo-700" style={{ minWidth: "180px" }}>
            Profession
          </th>
          {/* <td className="w-5 py-2 text-center">{1 + index++}</td> */}
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Jan
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Feb
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Mar
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Apr
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            May
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Jun
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Jul
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Aug
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Sep
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Oct
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Nov
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Dec
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
              {`₦ ${formatAmount(item?.jan)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.feb)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.mar)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.apr)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.may)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.jun)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.jul)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.aug)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.sep)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.oct)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.nov)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.dec)}`}
            </td>
            {/* <td className="w-10  py-2 px-1 text-center">
              {formatAmount(parseFloat(item?.totalAmount))}
            </td>
            <td className="w-10  py-2 px-1 text-center">{item.quantity}</td>
            <td className="w-10  py-2 px-1 text-center">
              {formatAmount(parseFloat(item.totalAmount))}
            </td> */}
            {/* <td
              className="w-10  py-2 px-1 text-center"
              onClick={() => removeItem(item)}
            >
              <TableBtnPrimary>Remove</TableBtnPrimary>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PayReqMonthlyDataTable;
