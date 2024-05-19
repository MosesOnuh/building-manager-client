// import spinner from "../../assets/spinner.gif";

// const Loader = () => (
//   <>
//     <img
//       src= {spinner}
//       style={{ width: "200px", margin: "auto", display: "block" }}
//       alt="Loading.."
//     />
//   </>
// );



import { ClipLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "100px auto",
};

const Loader = () => {
  return (
    <ClipLoader
      color="#4338ca"
      loading={true}
      cssOverride={override}
      // size={150}
    />
  );
};

export default Loader;