import { createContext, useState } from "react";

const MemberInfoContext = createContext({});

export const MemberInfoProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <MemberInfoContext.Provider value={{ user, setUser }}>
      {children}
    </MemberInfoContext.Provider>
  );
};

export default MemberInfoContext;
