import React, { useState, useEffect } from "react";

export default  function useHover (
  ref: React.RefObject<HTMLElement>,
  defaultState= false,
  delay = 0
){
  const [state, setState] = useState(defaultState);
  
  useEffect(() => {
    const onHover = () => setState(true);
    const onLeave = () => setTimeout(() => setState(false), delay);
    const node = ref.current;
    if (node) {
      node.addEventListener("mouseover", onHover);
      node.addEventListener("mouseleave", onLeave);
   
    return () => {
      
      const node2 = node;
      if (node2) {
        node2.removeEventListener("mouseover", onHover);
        node2.removeEventListener("mouseleave", onLeave);
      }
    };
}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return state;
};
