import { useRef, useState, useEffect } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './TextField.css';

const TextField = ({
    callback,
    label,
    name,
    defaultValue = 0,
    showCurrencySign = false,
    controlRef
}) => {
    const [value, setValue] = useState(defaultValue)
    const componentReady = useRef();

    const onInputChange = (value) => {
        setValue(value);
        callback(name, value);
    }

    const onSliderChange = (newValue) => {
        setValue(newValue);
        callback(name, newValue);
    }

    const incrementUp = (value) => {
        setValue(++value);
        callback(name, value);
    }

    const incrementDown = (value) => {
        setValue(--value);
        callback(name, value);
    }

    const onBackspace = (e) => {
        if (e.keyCode === 8) {
            setValue(0);
        }
    }

    useEffect(() => {
        componentReady.current = true;
    }, []);

    useEffect(() => {
        // const activeSegmentRef = segments[activeIndex].ref;
    }, [callback]);

    return (
        <div className="text-field-container" ref={controlRef}>
            <div className="text-field-label">{label}</div>
            <div className={`text-field ${componentReady.current ? 'ready' : 'idle'}`}>
                {showCurrencySign ? 
                    <div className="leading-symbol">$</div>  
                : null }
                <input 
                    type="number" 
                    value={value}
                    min="0"
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={onBackspace} />
                <div className="nudgers">
                    <div 
                        className="nudger nudge-down"
                        onClick={()=> incrementDown(value)}>-</div>
                    <div 
                        className="nudger nudge-up"
                        onClick={()=> incrementUp(value)}>+</div>
                </div>
            </div>
            <div className="slider">
                <Slider 
                    defaultValue={value}
                    value={value}
                    onChange={onSliderChange}
                     />
            </div>
        </div>
    );
}

export default TextField;