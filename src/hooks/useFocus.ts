import React, { useState, useEffect } from "react";

export default  function useFocus (
  ref: React.RefObject<HTMLElement>,
  defaultState= false,
  delay = 0
){
  const [state, setState] = useState(defaultState);
  
  useEffect(() => {
    const onFocus = () => setState(true);
    const onBlur = () => setTimeout(() => setState(false), delay);
    const node = ref.current;
    if (node) {
      node.addEventListener("focus", onFocus);
      node.addEventListener("blur", onBlur);
   
    return () => {
      
      const node2 = node;
      if (node2) {
        node2.removeEventListener("focus", onFocus);
        node2.removeEventListener("blur", onBlur);
      }
    };
}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return state;
};
