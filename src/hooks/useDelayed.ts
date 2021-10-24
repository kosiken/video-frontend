import { useState, useEffect, useRef } from "react";


function useDelayed<T>(initialValue: T, finalValue: T, delay: number): T {
    const [delayedValue, setDelayedValue] = useState(initialValue);
    let timeout = useRef(0);

    useEffect(() => {
        // if (updating) return;
    
        // setUpdating(true);
        // console.log("ran")
        if(timeout.current !== 0) { clearTimeout(timeout.current)}
    
        timeout.current = window.setTimeout(() => {
          setDelayedValue(finalValue);
           
        }, delay);
        return () => {
           if(timeout.current !==0 ) window.clearTimeout(timeout.current)
        }
    
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [initialValue] );

    return delayedValue;
}

export default useDelayed;