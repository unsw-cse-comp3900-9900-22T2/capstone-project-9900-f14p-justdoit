import React from 'react'
import Time from "../services/common/time"
import BasePage from "../components/BasePage"
class HotelReserve extends BasePage {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    Time.getTimeAsyncTrue();
  }

  render(){

    return (
        <React.Fragment>
        </React.Fragment>
    )
  }
}

export default HotelReserve