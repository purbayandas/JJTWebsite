import React from "react";


function Slide({slidePicture}){
    
    return (
        <img src={slidePicture} alt="" style={{
            height: "90vh",
            marginTop: "-70px",
            fontSize: "50px",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center" ,
            overflow: 'hidden'   
        }}/>
    );
}

export default Slide;