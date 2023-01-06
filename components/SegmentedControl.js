import { useRef, useState, useEffect } from "react";
import "./SegmentedControl.css";

const SegmentedControl = ({
  segments,
  callback,
  name,
  label,
  defaultIndex = 0,
  controlRef,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef();

  const onInputChange = (value, index) => {
    setActiveIndex(index);
    callback(name, value, index);
  };

  useEffect(() => {
    componentReady.current = true;
  }, []);

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref;
  }, [activeIndex, callback, segments]);

  return (
    <div className="controls-container" ref={controlRef}>
      <div className="control-label">{label}</div>
      <div className={`controls ${componentReady.current ? "ready" : "idle"}`}>
        {segments.map((item, i) => (
          <button
            key={item.value}
            className={`segment ${i === activeIndex ? "active" : "inactive"}`}
            ref={item.ref}
            onClick={() => onInputChange(item.value, i)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
