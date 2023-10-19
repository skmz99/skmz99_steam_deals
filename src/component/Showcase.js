import React, { useState, useEffect } from 'react';
import './Showcase.css'
import Carousel from './Carosuel';

const Showcase = (props) =>{
    const [data,setData] = useState();
    const [currentPage, setcurrentPage] = useState(0);
    const [URL, setURL] = useState(`https://www.cheapshark.com/api/1.0/deals?storeID=1&pageNumber=${currentPage}`);
    
    //CheapShark API does not support pageNumber for Title Lookup
    useEffect(()=>{
        setURL(props[`props`] + `&pageNumber=${currentPage}`)
    },[props,currentPage])

    useEffect(()=>{
        fetch(URL,{
            method: 'GET',
            redirect: 'follow'
        })
        .then(result=>{return result.json()})
        .then(response=>{setData(response)})
        .catch(err=>console.log(err))
    },[URL])

    const pageHandler = (e) => {
        if(parseInt(e.target.name) === currentPage){
            return;
        }
        else if(parseInt(e.target.name) < currentPage){
            return setcurrentPage(currentPage-(currentPage-e.target.name));
        }
        return setcurrentPage(currentPage+(parseInt(e.target.name)-currentPage));
    }

    const watchlisthHandler = (thumb, title, steamappId, normalPrice, salePrice, savings)=>{
        //backend not correctly implemented yet.

        // fetch('http://localhost:5432/insertWishlist',{
        fetch('https://smendez-steam-deals-229dfa09606a.herokuapp.com/insertWishlist',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection' : 'keep-alive'
            },
            credentials: 'include',
            body: JSON.stringify({
                picture: thumb,
                gameName: title,
                appId: steamappId,
                regularPrice: normalPrice,
                discountedPrice: salePrice,
                percentage: savings
            })
        })
        .then((res)=>{return res.json()})
        .catch((err)=>{console.log(err)})
    }

    const handleSearch = (e)=>{
        e.preventDefault();
        setURL(`https://www.cheapshark.com/api/1.0/games?title=${e.target[0].value}&limit=60&exact=0`)
    }

    return(
        <div className='showcase_container'>
            <div style={{height: '20%', /*background: 'lightgray'*/ overflow: 'hidden'}}>
                <Carousel/>
            </div>
            <div style={{height: '80%', display: 'flex', flexDirection : 'column'}}>
                <div style={{display: 'flex', minHeight: '25px', flexDirection: 'row', overflow: 'hidden'}}>
                    <div style={{width: '57%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        {currentPage >= 1? <button onClick={()=>{setcurrentPage(currentPage-1)}} className="page-button" type="button">{`<-`}</button>:""}
                        {currentPage < 46? 
                        <>
                        <button onClick={(e)=>{pageHandler(e)}} name={currentPage} className="page-button" type="button">{currentPage + ','}</button>
                        <button onClick={(e)=>{pageHandler(e)}} name={currentPage+1} className="page-button" type="button">{(currentPage +1) + `,`}</button>
                        <button onClick={(e)=>{pageHandler(e)}} name={currentPage+2} className="page-button" type="button">{(currentPage +2) + `,`}</button>
                        </>
                        :
                        <>
                        <button onClick={(e)=>{pageHandler(e)}}name={46} className="page-button" type="button">{46}</button>
                        <button onClick={(e)=>{pageHandler(e)}}name={47} className="page-button" type="button">{47}</button>
                        <button onClick={(e)=>{pageHandler(e)}}name={48} className="page-button" type="button">{48}</button>
                        </>
                    }                    
                        
                        {currentPage < 46? <button style={{cursor:'default', background: 'white'}} disabled={true} className="page-button">...</button>:""}
                        <button onClick={(e)=>{pageHandler(e)}} name={49} className="page-button" type="button">{49 + ','}</button>
                        <button onClick={(e)=>{pageHandler(e)}} name={50} className="page-button" type="button">{50}</button>
                        {currentPage === 50? "":<button onClick={()=>{setcurrentPage(currentPage+1)}} className="page-button" type="button">{`->`}</button>}
                    </div>
                    <div className='search-bar'>
                        <form onSubmit={(e)=>{handleSearch(e)}}>
                            <input className="search-barSize" type="text" placeholder="Search Game Title"/>
                            <button  type="submit">Search</button>
                        </form>
                    </div>
                </div>
                <div className='Showcase-games' style={{display: 'flex', justifyContent: 'center', alignItems: "center"}}>
                    {data === undefined ? "":
                        data.map((val,key)=>{
                            if(val.steamAppID !== undefined && val.cheapest === undefined){
                                return(
                                    <div key={key} className="Showcase-gamesRow">
                                        <button onClick={()=>{window.open(`https://store.steampowered.com/app/${val.steamAppID}`)}} className="Showcase-buttonLink" style={{height: '65px', width: '400px'}}>
                                            <img style={{height: '100%', width: '100%'}} src={val.thumb} alt={val.title}></img>
                                            </button>
                                            <div style={{border: '1px solid'}}/>
                                            <div style={{display: 'flex', flexGrow: 'inherit' ,height: '100%', width: '100%'}}>
                                                <span className="Showcase-gamesTexttitle" style={{flexWrap: 'wrap'}}>{val.title + ": "}</span>
                                            </div>
                                            <div className="Showcase-priceBox">
                                                <div style={{height: '20%', display: 'flex', justifyContent:  'center', alignItems: 'center'}}>
                                                    <span className="Showcase-gamesText" style={{fontSize: '10px', padding: '0'}}>Original</span>
                                                </div>
                                                <div style={{border: '1px solid black',  width: '100%', marginTop: '3px'}}/>
                                                <div style={{height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <span className="Showcase-gamesText" style={{padding: '7px'}}>{"$"+val.normalPrice}</span>
                                                </div>
                                            </div>
                                            <div className="Showcase-priceBox">
                                            <div style={{height: '20%', display: 'flex', justifyContent:  'center', alignItems: 'center'}}>
                                                    <span className="Showcase-gamesText" style={{fontSize: '10px', padding: '0'}}>Discount</span>
                                                </div>
                                                <div style={{border: '1px solid black',  width: '100%', marginTop: '3px'}}/>
                                                <div style={{height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <span className="Showcase-gamesText" style={{padding: '7px'}}>{"$"+val.salePrice}</span>
                                                </div>
                                            </div>
                                            <div className="Showcase-priceBox">
                                            <div style={{height: '20%', display: 'flex', justifyContent:  'center', alignItems: 'center'}}>
                                                    <span className="Showcase-gamesText" style={{fontSize: '10px', padding: '0'}}>Percentage</span>
                                                </div>
                                                <div style={{border: '1px solid black',  width: '100%', marginTop: '3px'}}/>
                                                <div style={{height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <span className="Showcase-gamesText" style={{padding: '7px'}}>{"%"+Math.floor(val.savings)}</span>
                                                </div>
                                            </div>
                                            <div className="Showcase-priceBox" style={{border: '1px solid black', backgroundColor: 'none'}}>
                                                <button 
                                                    onClick={()=>{
                                                        watchlisthHandler(
                                                            val.thumb, 
                                                            val.title, 
                                                            val.steamAppID, 
                                                            val.normalPrice, 
                                                            val.salePrice, 
                                                            val.savings
                                                        )}} 
                                                    className="Showcase-button">
                                                        Add to Watch list
                                                </button>
                                            </div>
                                        </div>
                                )
                            }
                            // else if(val.steamAppID != null && val.cheapest != null){
                            return(
                                <div key={key} className="Showcase-gamesRow">
                                    <button onClick={()=>{window.open(`https://store.steampowered.com/app/${val.steamAppID}`)}} style={{height: '65px', width: '400px',background: 'none', color: 'inherit', border: 'none', padding: '0', font: 'inherit', outline: 'inherit',cursor: 'pointer' }}>
                                        <img style={{height: '100%', width: '100%'}} src={val.thumb} alt={val.title}></img>
                                    </button>
                                    <div style={{border: '1px solid'}}/>

                                    <div style={{display: 'flex', flexGrow: 'inherit' ,height: '100%', width: '100%'}}>
                                            <span className="Showcase-gamesText" style={{fontSize: '.62vw',minWidth: '215px', maxWidth:'215px', flexWrap: 'wrap', flexShrink: 'initial'}}>{val.external + ": "}</span>
                                    </div>

                                    <div className="Showcase-priceBox">
                                        <div style={{height: '20%', display: 'flex', justifyContent:  'center', alignItems: 'center'}}>
                                            <span className="Showcase-gamesText" style={{fontSize: '10px', padding: '0'}}>Cheapest</span>
                                        </div>
                                        <div style={{border: '1px solid black',  width: '100%', marginTop: '3px'}}/>
                                        <div style={{height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <span className="Showcase-gamesText" style={{padding: '7px'}}>{"$"+val.cheapest}</span>
                                        </div>
                                    </div>
                                    <div className="Showcase-priceBox" style={{border: '1px solid black', backgroundColor: 'none'}}>
                                        <button 
                                            onClick={()=>{
                                                watchlisthHandler(
                                                    val.thumb, 
                                                    val.title, 
                                                    val.steamAppID, 
                                                    val.normalPrice, 
                                                    val.salePrice, 
                                                    val.savings
                                                )}} 
                                            className="Showcase-button">
                                                Add to Watch list
                                        </button>
                                    </div>
                                </div>
                            )
                            // }
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Showcase;