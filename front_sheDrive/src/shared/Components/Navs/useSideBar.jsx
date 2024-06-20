import { useState } from "react";

const useSideBar = ({ routes }) => {
  const [items, setItems] = useState(routes || []);
  return { items };
};

export default useSideBar;
