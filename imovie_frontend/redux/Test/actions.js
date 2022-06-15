import * as constants from "./constants"
import timeServices from "../../services/common/time"


export const getTime = (res) => {
    return function (dispatch) {
        timeServices.getTimeRedis(res).then((res) => {

            dispatch({
                type : constants.GET_TIME_SUCCESS,
                ...{
                    result : res
                }
            })

        }).catch((err) => {
            console.log("err",err);
            dispatch({
                type : constants.GET_TIME_FAIL,
                ...err
            })
        })

    }
}
