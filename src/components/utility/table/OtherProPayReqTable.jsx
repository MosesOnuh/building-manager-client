import React from "react";
import { GetDate } from "../../../utils/timeUtil";
import {formatAmount, paymentRequestStatus } from "../../../utils/constants";

function OtherProPayReqTable({ items, displayPayReq }) {
  return (
    <table className=" w-full overflow-x-auto text-xs md:text-sm lg:text-base">
      <thead>
        <tr className="bg-indigo-700 text-white">
          <th className=" py-2 border-indigo-700 px-1  w-5">S/N</th>
          <th className="w-35 border-indigo-700" style={{ minWidth: "180px" }}>
            Name of Request
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Date Requested
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Total Amount
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Status
          </th>
          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Type
          </th>

          <th className="w-10  border-indigo-700" style={{ minWidth: "68px" }}>
            Action
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
            // className="hover:bg-indigo-300 focus:bg-gray:500"
          >
            <td className="w-5 py-2 text-center">{item?.serialNumber}</td>
            <td className="w-35  py-2 pl-3 pr-1 ">{item?.name}</td>
            <td className="w-10  py-2 px-1 text-center">
              {GetDate(item.createdAt)}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {`₦ ${formatAmount(item?.sumTotalAmount)}`}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {paymentRequestStatus[item?.status]}
            </td>
            <td className="w-10  py-2 px-1 text-center">
              {item?.type === 1 ? "Single" : "Group"}
            </td>
            <td
              className="w-10  py-2 px-1 text-center"
              onClick={() => displayPayReq(item)}
            >
              <TableBtnPrimary>View</TableBtnPrimary>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}



const TableBtnPrimary = ({ children }) => {
  return (
    <>
      <button className="text-xs bg-blue-100 text-black  py-1 px-2 rounded-lg hover:bg-blue-200 shadow-l">
        {children}
      </button>
    </>
  );
};

export default OtherProPayReqTable;


// {
//             "userId": "58705773-675c-4f89-a475-9a2638faa1aa",
//             "firstName": "moses",
//             "lastName": "moses",
//             "role": 2,
//             "profession": 3,
//             "projectId": "4a926ece-3b95-47ad-8883-4e9e60c3f350",
//             "paymentRequestId": "7db1ec5f-1a2a-49f7-a495-729e2d7480c5",
//             "paymentRequestName": "Type check 31",
//             "status": 1,
//             "type": 2,
//             "description": null,
//             "items": [
//                 {
//                     "id": "94cd0a7b-bfc3-4a6f-b86d-7d345ee92451",
//                     "paymentRequestId": "7db1ec5f-1a2a-49f7-a495-729e2d7480c5",
//                     "name": "now now create activity",
//                     "price": 3400.00,
//                     "quantity": 5.00,
//                     "totalAmount": 17000.00
//                 }
//             ],
//             "sumTotalAmount": 17000.00,
//             "userFileName": null,
//             "userStorageFileName": null,
//             "pmFileName": null,
//             "pmStorageFileName": null,
//             "createdAt": "2024-06-27T09:36:00.173",
//             "confirmedAt": null
//         }