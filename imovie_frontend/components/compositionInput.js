import React, {useImperativeHandle, useRef} from 'react';
import {Input,Select} from "antd";
let composition = true;
const InputComponent = (props) => {
    const selectRef = useRef();
    useImperativeHandle(props.selectRef, () => ({
        blur: () => {
            selectRef.current.blur &&  selectRef.current.blur();
        },
    }));
    function onCompositionStart() {
        composition = false;
    }
    function onCompositionEnd(e) {
        composition = true;
        onChange(e)
    }
    function onChange(e) {
        e = e || ""
        if (composition) {
            if( props.inputType === "input" ){
                props.onChange && props.onChange(e);
            }else if(props.inputType === "select"){
                let value = e || ""
                if((e && e.target && e.target.value ) !== null && (e && e.target && e.target.value ) !== undefined){
                    value = e && e.target && e.target.value
                }else{
                    value = e
                }
                props.onSearch && props.onSearch(value || "");
                props.changeForSearchValueInit && props.changeForSearchValueInit(value || "");
            }

        }
    }
    return (
        <>
            {
                props.inputType === "input" ?
                    <Input
                        {
                            ...props
                        }
                        onCompositionStart={()=>onCompositionStart()}
                        onCompositionUpdate={() => onCompositionStart()}
                        onCompositionEnd={(e)=> onCompositionEnd(e)}
                        onChange={(e)=>{
                            onChange(e)
                        }}
                    />:
                    props.inputType === "select" ?
                        <Select
                            {
                                ...props
                            }
                            ref={selectRef}
                            onCompositionStart={()=>onCompositionStart()}
                            onCompositionUpdate={() => onCompositionStart()}
                            onCompositionEnd={(e)=> onCompositionEnd(e)}
                            onSearch={(value) => {
                                console.log("value",value)
                                onChange(value)
                            }}
                            onScroll={(event)=>{
                                event.stopPropagation();
                            }}
                        />:
                        <div/>
            }
        </>
    );
};

export default InputComponent;
