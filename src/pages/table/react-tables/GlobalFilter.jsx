import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = (e) => {
    setValue(e.target.value);
    setFilter(e.target.value || undefined);
  };
  return (
    <div className="w-full sm:w-auto sm:min-w-[200px]">
      <Textinput
        value={value || ""}
        onChange={onChange}
        placeholder="Search..."
      />
    </div>
  );
};

export default GlobalFilter;
