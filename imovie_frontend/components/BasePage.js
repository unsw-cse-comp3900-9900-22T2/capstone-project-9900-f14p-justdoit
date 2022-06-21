/**
 * Created by chen on 2020/4/10.
 */
import React from 'react'
import commonStore from '../util/store'

class BasePage extends React.Component {
    constructor(props) {
        super(props);
    }

    setRedux(state, reducers, actions, sagas){
        this.store = commonStore.createStoreWithMiddleware(reducers, state);
        this.state = this.store.getState();

        if(sagas != undefined){
            actions = sagas;
            const sagaMiddleware = commonStore.sagaMiddleware;
            sagaMiddleware.run(sagas.mySaga);
        }

        this.action = commonStore.createAction(actions, this.store.dispatch);

        this.unsubscribe = this.store.subscribe(() => {
            this.setState(this.store.getState());
        });
    }

    /*
       子类若使用到 componentWillUnmount 方法，得先调用 super.componentWillUnmount()
     */
    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }
}

export default BasePage