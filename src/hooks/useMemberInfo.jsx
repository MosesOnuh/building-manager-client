import { useContext } from "react";
// import AuthContext from "../context/AuthProvider";
import MemberInfoContext from "../context/MemberDetail";

const useMemberInfo = () => {
  return useContext(MemberInfoContext);
};

export default useMemberInfo;
