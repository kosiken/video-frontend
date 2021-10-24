import { useState, useEffect, useRef } from "react";

function useDebounce(searchValue: string, time: number): string {
  const [debouncedValue, setDebouncedValue] = useState("");
   let timeout = useRef(0);

  useEffect(() => {
    // if (updating) return;

    // setUpdating(true);
    // console.log("ran")
    if(timeout.current != 0) { clearTimeout(timeout.current)}

    timeout.current = window.setTimeout(() => {
      setDebouncedValue(searchValue);
       
    }, time);
    return () => {
       if(timeout.current !=0 ) window.clearTimeout(timeout.current)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return debouncedValue;
}

export default useDebounce;

