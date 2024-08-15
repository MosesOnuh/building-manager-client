import React from "react";
import OtherProPayReq from "./OtherProPayReq";
import ClientPayReq from "./ClientPayReq";
import PmPayReq from "./PmPayReq";
import useMemberInfo from "../../hooks/useMemberInfo";

const PaymentRequest = () => {
  const { user: memberDetail } = useMemberInfo();

  return (
    <>
      {memberDetail && memberDetail.role === 1 && (
        <PmPayReq userInfo={memberDetail} />
      )}
      {memberDetail && memberDetail.role === 2 && (
        <OtherProPayReq userInfo={memberDetail} />
      )}
      {memberDetail && memberDetail.role === 3 && (
        <ClientPayReq userInfo={memberDetail} />
      )}
    </>
  );
};

export default PaymentRequest;
