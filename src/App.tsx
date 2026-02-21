// import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "./App.css";
// import { fetchPosts } from "./api/api";
import Postlists from "./components/post-lists";

function App() {
  const [toggle, setToggle] = useState(true);
  return (
    <>
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        toggle
      </button>
      {toggle && <Postlists />}
    </>
  );
}

export default App;
