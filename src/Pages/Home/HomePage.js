import NavBarComponent from "../../Components/Navbar/Navbar";
import CarouselComponent from "../../Components/SlidesCarousel/Carousel";
import "./Home.css"
import { useState, useEffect } from "react";

// require("dotenv").config({ path: '../../../src/.env' });
// const aws = require("aws-sdk");

import aws from "aws-sdk";



aws.config.update({
    secretAccessKey: process.env.REACT_APP_ACCESS_SECRET,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    region: process.env.REACT_APP_REGION,
    // Note: 'bucket' is not a valid AWS SDK configuration property
});

const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
const s3 = new aws.S3();



const section = "Home_Page";

async function importImages(){
    let picturesURLsArray = [];

    async function getPicsFromS3(){
        const response = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: section }).promise();
        
        return response;
    }

    const picturesArray = (await getPicsFromS3()).Contents;
    
    const picturesKeysArray = picturesArray.map(function (picture){
        if (picture.Key[picture.Key.length-1] !== "/"){
            return picture.Key;
        }
    }).filter(function(element){
        return element !== undefined;
    });  
    
    
    picturesURLsArray = picturesKeysArray.map(function(key){
        return `https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/${key}`
    });


    return picturesURLsArray;  
}  
      

function HomePage(){
    
    const [imagesArray, setImagesArray] = useState([]);
    
    useEffect(() => {
        const fetchAndSetImagesArray = async function(){
        const imagesArrayHolder = await importImages();
        setImagesArray(imagesArrayHolder);
        }
        fetchAndSetImagesArray();
    },[]);

    
    return (
        <div className="Home">
            
            <CarouselComponent images={imagesArray} time="2"/>
        </div>
    )
}

export default HomePage;