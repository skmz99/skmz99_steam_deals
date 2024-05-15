import React, {useState, useEffect, useRef} from "react";
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
    <div className="App" style={{height: `${window.outerHeight}px`, width: `${window.outerWidth}`}}>
      <div className="filterSide">
        <Filter handleCallback={callBack}/>
      </div>
      <div style={{
        flexDirection: 'column',
        height: 'inherit',
        width: '80%',
        borderRight: '1px solid'
      }}>
          <Showcase props={filter}/>
      </div>
      <div style={{height: 'inherit', width: '10%'}}>
        <Profile/>
      </div>
    </div>
  );
}
export default App;