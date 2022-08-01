import React, { useState, useRef, useMemo, useImperativeHandle, useEffect } from 'react';
import { Select, Spin,Tooltip } from 'antd';
const { Option } = Select;
import _ from 'lodash';
import InputComponent from "./compositionInput"
let scrollTopVal = 0 ;
function getNewDom(string,searchWord){
    string = (string || "").toString();
    searchWord = (searchWord || "").toString();
    const upperCaseSearch = searchWord.toUpperCase();
    const upperCaseString = string.toUpperCase();
    const stringList = upperCaseString.split(upperCaseSearch);
    let beforeLength = 0;
    for(let i = 0 ; i < stringList.length - 1; i++){
        beforeLength += stringList[i].length;
        const searchLength = searchWord.length;
        string = string.substring(0,beforeLength) + "#*#"+ string.substring(beforeLength,beforeLength + searchLength)+ "*#*" + string.substring(beforeLength + searchLength);
        beforeLength += (searchLength + 6)
    }
    return string.replace(/#*#/g, '<span>').replace(/\*#*/g, '</span>')
}
const DebounceSelect = ({ hasOpen, selectRef, fetchOptions, initShowList,debounceTimeout = 800, ...props }) => {
    const [hasSmall] = useState(props.hasSmall)
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const [open, changeOpen] = useState(false);
    const [focusNow, changeFocusNow] = useState(false);
    const [inputValue,changeInputValue] = useState("")
    const cRef = useRef();
    const fetchRef = useRef(0);
    const [fromSelect,changeFromSelect] = useState(false)
    useImperativeHandle(selectRef, () => ({
        setFocus: () => {
            setFocus();
        },
    }));
    useEffect(() => {
        const { value, mode } = props;
        if (!!value && mode !== 'multiple') {
            if(initShowList){
                fetchOptions && fetchOptions("").then((data) => {
                    setFetching(false);
                    const { list, value } = data;
                    for (let i = 0; i < list.length; i++) {
                        const _newOptions = list[i];
                        if(_newOptions) {
                            _newOptions.showName = getNewDom(
                                _newOptions.userEname + '（' + _newOptions.userName + ' / ' + _newOptions.userId + '）',
                                value,
                            );
                        }
                    }
                    setOptions(list);
                    changeInputValue(props.value)
                    if(props.dounceType){
                        props.onChange && props.onChange(props.value);
                    }
                });
            }else{
                fetchOptions && fetchOptions(value).then((data) => {
                    setFetching(false);
                    const { list, value } = data;
                    for (let i = 0; i < list.length; i++) {
                        const _newOptions = list[i];
                        if(_newOptions) {
                            _newOptions.showName = getNewDom(
                                _newOptions.userEname + '（' + _newOptions.userName + ' / ' + _newOptions.userId + '）',
                                value,
                            );
                        }
                    }
                    setOptions(list);
                    changeInputValue(value)
                    if(props.dounceType){
                        props.onChange && props.onChange(value);
                    }
                });
            }

        }else{
            if(initShowList ){
                fetchRef.current += 1;
                const fetchId = fetchRef.current;
                setFetching(true);
                setOptions([]);
                changeFromSelect(false)
                fetchOptions && fetchOptions(value).then((data) => {
                    setFetching(false);
                    const { list, value } = data;
                    if (fetchId !== fetchRef.current) {
                        // for fetch callback order
                        return;
                    }
                    for (let i = 0; i < list.length; i++) {
                        const _newOptions = list[i];
                        if(_newOptions) {
                            _newOptions.showName = getNewDom(
                                _newOptions.userEname + '（' + _newOptions.userName + ' / ' + _newOptions.userId + '）',
                                value,
                            );
                        }
                    }
                    setOptions(list);
                    changeInputValue(value)
                });
            }
        }

    }, []);
    function setFocus() {
        cRef.current.focus();
        changeOpen(true);
    }
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            changeFocusNow(!value);
            if (!!value) {
                fetchRef.current += 1;
                const fetchId = fetchRef.current;
                setFetching(true);
                setOptions([]);
                changeFromSelect(false)
                fetchOptions && fetchOptions(value).then((data) => {
                    setFetching(false);
                    const { list, value } = data;
                    if (fetchId !== fetchRef.current) {
                        // for fetch callback order
                        return;
                    }
                    for (let i = 0; i < list.length; i++) {
                        const _newOptions = list[i];
                        if(_newOptions){
                            _newOptions.showName = getNewDom(
                                _newOptions.userEname + '（' + _newOptions.userName + ' / ' + _newOptions.userId + '）',
                                value,
                            );
                        }

                    }
                    setOptions(list);
                    changeInputValue(value)
                });
            } else {
             /*   setOptions([]);
                changeInputValue("")*/
            }
        };

        return _.debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <>
            <InputComponent
                inputType={"select"}
                allowClear={true}
                selectRef={cRef}
                labelInValue={props.mode === 'multiple'}
                open={open}
                filterOption={false}
                style={{
                    minHeight: '100px',
                }}
                onFocus={() => {
                    changeOpen(true);
                    changeFocusNow(true);
                    scrollTopVal = document.documentElement.scrollTop || document.body.scrollTop;
                    // 禁止滑动
                    const _dom =  document.getElementsByClassName("base_page")[0];
                    _dom.style.position = "fixed";
                    _dom.style.top = "-" + scrollTopVal + 'px';
                    _dom.style.width = '100%';
                    _dom.style.overflow = "hidden";
                }}
                onClear={()=>{
                    if(initShowList ){
                        fetchRef.current += 1;
                        const fetchId = fetchRef.current;
                        setFetching(true);
                        setOptions([]);
                        changeFromSelect(false)
                        fetchOptions("").then((data) => {
                            setFetching(false);
                            const { list, value } = data;
                            if (fetchId !== fetchRef.current) {
                                // for fetch callback order
                                return;
                            }
                            for (let i = 0; i < list.length; i++) {
                                const _newOptions = list[i];
                                if(_newOptions) {
                                    _newOptions.showName = getNewDom(
                                        _newOptions.userEname + '（' + _newOptions.userName + ' / ' + _newOptions.userId + '）',
                                        value,
                                    );
                                }
                            }
                            setOptions(list);
                            changeInputValue("")
                        });
                    }
                }}
                onBlur={() => {
                    if(inputValue && !fromSelect && !!props.noListDom){
                        props.onChange && props.onChange(props.noListValue && props.noListValue(inputValue) || inputValue);
                    }
                    changeOpen(false);
                    setFetching(false);
                    changeFocusNow(false);
                    const _dom = document.getElementsByClassName("base_page")[0];
                    var scrollVal = Math.abs(parseFloat(_dom.style.top));
                    _dom.style.position = "";
                    _dom.style.overflow = "";
                    _dom.style.top = "";
                    if (document.body) {
                        document.body.scrollTop = scrollVal;
                    }
                    if (document.documentElement) {
                        document.documentElement.scrollTop = scrollVal;
                    }
                }}
                tagRender={(props) => {
                    const { label } = props;
                    let string = '';
                    if (typeof label === 'string') {
                        string = label;
                    } else {
                        string =
                           label && label.length > 0 && label[0].props &&
                            label[0].props.dangerouslySetInnerHTML &&
                            (label[0].props.dangerouslySetInnerHTML.__html || "").replace(/<span>/g, '').replace(/<\/span>/g, '');
                        if(hasSmall && !!string){
                            const kuoHao = string.split("（");
                            const right = kuoHao.length >= 2 ? kuoHao[1] : "";
                            string = right.split("）")[0];
                        }
                    }
                    if (!string) {
                        return '';
                    }
                    return (
                        <div
                            className="ant-select-selection-overflow-item"
                            style={{
                                opacity: 1,
                                order: 0,
                            }}
                            title={string}
                        >
                            <span className="ant-select-selection-item">
                                <Tooltip title={string}>
                                       <span className="ant-select-selection-item-content">{string}</span>
                                </Tooltip>
                                <span
                                    className="ant-select-selection-item-remove"
                                    unselectable="on"
                                    aria-hidden="true"
                                    style={{
                                        userSelect: 'none',
                                    }}
                                >
                                    <span
                                        role="img"
                                        aria-label="close"
                                        onClick={(e) => {
                                            e && e.stopPropagation();
                                            props.onClose && props.onClose();
                                        }}
                                        className="anticon anticon-close"
                                    >
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="close"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8
                                                        295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9
                                                        824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5
                                                        258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                                            />
                                        </svg>
                                    </span>
                                </span>
                            </span>
                        </div>
                    );
                }}
                onSearch={debounceFetcher}
                notFoundContent={fetching ? <Spin size="small" /> : focusNow ? null : <div>No films yet</div>}
                {...props}
                onChange={(newValue)=>{
                    props.onChange && props.onChange(newValue);
                    if(props.mode !== 'multiple'){
                        changeOpen(false);
                        setFetching(false);
                        changeFocusNow(false);
                        changeFromSelect(true);
                        setTimeout(()=>{
                            cRef.current.blur();
                        },100)

                    }
                }}
            >
                {options.length > 0 ? (props.nodeDom && props.nodeDom(options,inputValue) || (options &&
                    options.map((item) => {
                        return (
                            <>
                                {(props.mode === 'multiple' ? (
                                    <Option key={'item_' + item.userId} value={item.userId} option={item}>
                                        <h6
                                            style={{
                                                fontSize:hasSmall ? '11px': '14px',
                                                color: '#333',
                                                margin: 0,
                                                fontWeight: 'bold',
                                            }}
                                            className="optionH6Get"
                                            dangerouslySetInnerHTML={{
                                                __html: (item.showName || ''),
                                            }}
                                        />
                                        <h6
                                            style={{
                                                fontSize: hasSmall ? '10px':'12px',
                                                lineHeight: hasSmall ? '16px':'22px',
                                                color: '#999',
                                                margin: 0,
                                                width: '100%',
                                                wordBreak: 'break-all',
                                                display: 'block',
                                                whiteSpace: 'normal',
                                            }}
                                        >
                                            {item.organization}
                                        </h6>
                                    </Option>
                                ) : (
                                    <Option key={'item_' + item.userId} value={item.userId} option={item}>
                                        {item.userId} - {item.displayName}
                                    </Option>
                                ))}
                            </>
                        );
                    }))) : (inputValue && props.noListDom && props.noListDom(inputValue))}
            </InputComponent>
            <style>
                {`
                    .ant-select-item-option-state{
                      display :flex;
                      align-items : center!important;
                    }
                    .optionH6Get span{
                       color : #1658dc
                    }
                    .ant-select-selection-item{
                       margin-bottom : 4px!important;
                    }
                    `}
            </style>
        </>
    );
};

export default DebounceSelect;
