import React, {useState} from "react";
import Filter from "./component/Filter";
import Showcase from "./component/Showcase";
import './App.css';
import Profile from "./component/Profile";

const App = ()=>{
  const [filter,setFilter] = useState("https://www.cheapshark.com/api/1.0/deals?storeID=1");

  const callBack = (filterCallback) => {
    setFilter(filterCallback);
  }

  return(
    <div className="App" style={{}}>
      <div className="filterSide">
        <Filter handleCallback={callBack}/>
      </div>
      <div className="middleGameDeals">
        <Showcase props={filter}/>
      </div>
      <div className="profileSetup">
          <Profile/>
      </div>
    </div>
  );
}
export default App;