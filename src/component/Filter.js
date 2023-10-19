import React,{useState} from 'react';
import './Filter.css';

const Filter = (props)=>{
    const [minVal, setminVal] = useState('');
    const [maxVal, setmaxVal] = useState('');
    const [checkBox, setcheckBox] = useState('');
    const [filterArray, setfilterArray] = useState([]);

    const handlePriceRange = (e) =>{
        const regex = /^[0-9./b]+$/;
        let value = e.target.value;
        //allows for only numbers to be entered along with allowing for a single decimal to be entered
        if( (e.target.value === "" || regex.test(value)) && (e.target.value.split(".").length-1) < 2){
            e.target.name === `Min: $` ? setminVal(value) : setmaxVal(value);
        }
    }

    const removeFilter = (filter)=>{
        var arr = [...filterArray];
        var index = "";
        if(filter === "Min" || filter === "Max"){
            if(arr[arr.findIndex(arr=>arr.includes("Min"))] === filter + `: $${minVal}` || arr[arr.findIndex(arr=>arr.includes("Max"))] === filter + `: $${maxVal}`){
                return
            }
            index = arr.findIndex(arr=>arr.includes(filter));
        }else{
            //This will be accessed by the check boxes 
            index = arr.indexOf(filter);
        }

        if(index !== -1){
            arr.splice(index,1);
            // console.log(arr)
            setfilterArray(arr);
        }
    }

    const addminFilter = async(e) =>{
        removeFilter("Min");
        const index = filterArray.findIndex(arr=>arr.includes(e.target.name))
        if(filterArray[index] !== (e.target.name + `${minVal}`) && e.target.value.length >= 1){
            setfilterArray(prevArray=>[...prevArray,e.target.name + `${minVal}`])
        }
    }

    const addmaxFilter = async(e) =>{
        removeFilter("Max");
        const index = filterArray.findIndex(arr=>arr.includes(e.target.name));
        if(filterArray[index] !== (e.target.name + `${maxVal}`) && e.target.value.length >= 1){
            setfilterArray(prevArray=>[...prevArray, e.target.name + `${maxVal}`])
        }

    }

    const filterCheckbox = (e) => {
        // console.log(e.target)
        let arr = filterArray
        let index = arr.findIndex(arr=>arr.includes("Sort"));
        if(index !== -1){
            arr.splice(index,1);
            // console.log(arr)
            setfilterArray(arr);
        }

        if(e.target.checked){
            setfilterArray(prevArray=>[...prevArray,e.target.name])
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        //When calling this function Reset URL to its original before the for loop
        let sample = "https://www.cheapshark.com/api/1.0/deals?storeID=1";
        if(minVal !== '') sample += `&lowerPrice=${minVal}`;
        if(maxVal !== '') sample += `&upperPrice=${maxVal}`;
        
        for(let i = 2; i < 11; i++){
            if(e.target[i].checked){
                // return props.handleCallback(`Original URL with ${i}`)
                switch(i){
                    case(2):
                        sample += "&sortBy=Deal Rating";
                        break;
                    case(3):
                        sample += "&sortBy=Title";
                        break;
                    case(4):
                        sample += "&sortBy=Saving";
                        break;
                    case(5):
                        sample += "&sortBy=Price";
                        break;
                    case(6):
                        sample += "&sortBy=Metacritic";
                        break;
                    case(7):
                        sample += "&sortBy=Reviews";
                        break;
                    case(8):
                        sample += "&sortBy=Release";
                        break;
                    case(9):
                        sample += "&sortBy=Recent";
                        break;
                    default:
                        break;
                }
                return props.handleCallback(sample)
            }            
        }
        return props.handleCallback(sample)
    }

    return(
        <div className='filterContainer'>
            <form onSubmit={(e)=>{handleSubmit(e)}}>
                <div className='priceRange-container'>
                    <div className='priceMin-container'>
                        <div className='minInput-rowContainer'>
                            <span style={{fontSize: '20px', fontWeight: 'bold'}}>$</span>
                            <input
                                maxLength={6}
                                className='price-box'
                                type="text"
                                placeholder="Min"
                                value={minVal}
                                onBlur={(e)=>{addminFilter(e)}}
                                onChange={(e)=>{handlePriceRange(e)}}
                                name={`Min: $`}
                                />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <span>Min</span>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                        <hr className="priceRange-middleLine"/>
                    </div>
                    <div className='priceMax-container'>
                        <div className='maxInput-rowContainer'>
                            <span style={{fontSize: '20px', fontWeight: 'bold'}}>$</span>
                            <input
                                maxLength={6}
                                className='price-box'
                                type="text"
                                placeholder="Max"
                                value={maxVal}
                                onBlur={(e)=>{addmaxFilter(e)}}
                                onChange={(e)=>{handlePriceRange(e)}}
                                name={`Max: $`}
                                />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <span>Max</span>
                        </div>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <span>Sort By: </span>
                    </div>
                    <div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Deal Rating</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Deal Rating"
                                    checked={checkBox === "Deal Rating"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Deal Rating" ? setcheckBox("Deal Rating") : setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Title</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Title"
                                    checked={checkBox === "Title"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Title" ? setcheckBox("Title") : setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Saving</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Saving"
                                    checked={checkBox === "Saving"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Saving" ? setcheckBox("Saving") : setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Price</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Price"
                                    checked={checkBox === "Price"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Price" ? setcheckBox("Price") : setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Metacritic</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Metacritic"
                                    checked={checkBox === "Metacritic"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Metacritic" ? setcheckBox("Metacritic") : setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Reviews</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Reviews"
                                    checked={checkBox === "Reviews"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Reviews" ? setcheckBox("Reviews"): setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Release</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Release"
                                    checked={checkBox === "Release"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Release" ? setcheckBox("Release") : setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                        <div className='sortBy-boxItems'>
                            <div style={{width: '50%'}}>
                                <span>Recent</span>
                            </div>
                            <div className='sortBy-checkBox'>
                                <input
                                    name="Sort By: Recent"
                                    checked={checkBox === "Recent"}
                                    onClick={(e)=>{filterCheckbox(e)}}
                                    onChange={()=>{checkBox !== "Recent" ? setcheckBox("Recent") : setcheckBox('')}}
                                    type="checkbox"
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <button type="submit">submit</button>
                </div>
                <div>
                    <div style={{}}>
                        <span>Added Filters: </span>
                    </div>
                    {filterArray.length === 0 ?
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <span style={{opacity: 0.45, fontSize: '10px'}}>No Added Filters</span>
                        </div>
                        :
                        <div className="filter-container">
                            {filterArray.map((val,key)=>{
                                return(
                                    <span key={key} className="filter-box" style={{fontSize: '10px'}}>{val}</span>
                                )
                            })}
                        </div>
                    }

                </div>
            </form>
        </div>
    )
};

export default Filter;