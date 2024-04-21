import spinner from "../../assets/spinner.gif";

const Loader = () => (
  <>
    <img
      src= {spinner}
      style={{ width: "200px", margin: "auto", display: "block" }}
      alt="Loading.."
    />
  </>
);

export default Loader;