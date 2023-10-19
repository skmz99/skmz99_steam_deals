import React, {useState, useEffect} from 'react'
import './Carosuel.css'

const Carousel = () =>{
    const [data, setData] = useState([]);
    const [currentIndex, setcurrentIndex] = useState(0);

    //Want useEffect to run once since it will only display five same games in the carousel 
    useEffect(()=>{
        fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=5&onSale=5&metacritic=85&steamRating=85&AAA=1',
            {
                method: 'GET',
                redirect: 'follow'
            }
        )
        .then((response) => {return response.json()})
        .then((res) =>{setData(res)})
        .catch(error => console.log('error: ', error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const carouselInfiniteScroll = () =>{
        if(currentIndex === data.length-1){
            return setcurrentIndex(0);
        }
        return setcurrentIndex(currentIndex+1);
    }

    useEffect(()=>{
        const interval = setInterval(()=>{carouselInfiniteScroll()},3500);
        return()=>clearInterval(interval);
    })

    const nextSlide = () =>{
        if(currentIndex === data.length-1){
            //if index is the last at the last element go back to the start
            return setcurrentIndex(0);
        }
        //otherwise move on to the next slide
        return setcurrentIndex(currentIndex+1);
    }

    const prevSlide = () =>{
        if(currentIndex === 0){
            //loop back to the last slide if index is at the start
            return setcurrentIndex(data.length-1);
        }
        //otherwise go to previous slide
        return setcurrentIndex(currentIndex-1);
    }

    return(
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <button type="button" className='arrow-buttons' onClick={()=>prevSlide()}>{`<`}</button>
            <div className="image-container">
                {data.length <= 0 ?
                    <h1>Loading...</h1>
                    :
                    data.map((val, key)=>{
                        return(
                            <button key={key} onClick={()=>{window.open(`https://store.steampowered.com/app/${val.steamAppID}`)}} className="button-image" style={{display: currentIndex===key? "":"none"}}>
                                <div style={{display: 'flex', flexDirection: 'row'}} className="image-textSpace">
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <div style={{borderBottom: '1px solid black'}}>
                                            <span className='image-text'>Price</span>
                                        </div>
                                        <div>
                                            <span className="image-text">{`$`+val.salePrice}</span>
                                        </div>
                                    </div>
                                    <div style={{border: '1px solid'}}/>
                                    <div stlye={{display: 'flex', flexDirection: 'column'}}>
                                        <div style={{borderBottom: '1px solid black'}}>
                                            <span className='image-text'>Discount</span>
                                        </div>
                                        <div stlye={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <span className="image-text">{Math.floor(val.savings) + `%`}</span>
                                        </div>
                                    </div>
                                </div>
                                <img  
                                    className='pic-size'
                                    style={{objectFit:'fill'}}  
                                    src={val.thumb} 
                                    alt="pic"
                                    />
                            </button>
                        )
                    })}
            </div>
            <button type="button" className="arrow-buttons" onClick={()=>nextSlide()}>{`>`}</button>
        </div>
    )
}

export default Carousel;