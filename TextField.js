import { useRef, useState, useEffect } from "react";
import './TextField.css';

const TextField = ({
    // segments,
    callback,
    label,
    defaultValue = 0,
    leadingSymbol = '$',
    defaultIndex = 0,
    controlRef
}) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const [value, setValue] = useState(defaultValue)
    const componentReady = useRef();

    const onInputChange = (event) => {
        setValue(event.target.value);
    }

    const incrementUp = (value) => {
        setValue(++value);
    }

    const incrementDown = (value) => {

        setValue(--value);
    }

    useEffect(() => {
        componentReady.current = true;
    }, []);

    useEffect(() => {
        // const activeSegmentRef = segments[activeIndex].ref;
    }, [activeIndex, callback]);

    return (
        <div className="text-field-container" ref={controlRef}>
            <div className="text-field-label">{label}</div>
            <div className={`text-field ${componentReady.current ? 'ready' : 'idle'}`}>
                <input type="number" 
                value={value}
                min="0"
                onChange={onInputChange} />
                <div className="nudgers">
                    <div 
                        className="nudger nudge-up"
                        onClick={()=> incrementUp(value)}
                    >+</div>
                    <div 
                        className="nudger nudge-down"
                        onClick={()=> incrementDown(value)}
                    >-</div>
                </div>
            </div>
            <div className="slider">Slide me in</div>
                {/* {segments.map((item, i) => (

                    <button 
                        key={item.value}
                        className={`segment ${i === activeIndex ? 'active': 'inactive'}`}
                        ref={item.ref} 
                        onClick={() => onInputChange(item.value, i)}>
                        {item.label}
                    </button> 
                ))} */}
            
        </div>
    );
}

export default TextField;