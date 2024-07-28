import NavBarComponent from "../../Components/Navbar/Navbar";
import CarouselComponent from "../../Components/SlidesCarousel/Carousel";
import "./Home.css"
import { useState, useEffect } from "react";
import aws from "aws-sdk";
import useContextMenu from "../../CustomHooks/useContextMenuHook/useContextMenuHook";
import { ContextMenu } from "../../Styles/RightClickStyles/RightClickStyles";
import { useNavigate } from "react-router-dom";
import Home_Admin_Page from "../AdminDashboards/Home-Admin/Home-Admin";

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

    const navigate = useNavigate();
    function navigateToAdminDashboard(e){
        navigate("/home/admin");    
    }

    const { clicked, setClicked, points, setPoints } = useContextMenu();
    
    const [imagesArray, setImagesArray] = useState([]);
    
    useEffect(() => {
        const fetchAndSetImagesArray = async function(){
        const imagesArrayHolder = await importImages();
        setImagesArray(imagesArrayHolder);
        }
        fetchAndSetImagesArray();
    },[]);

    
    return (
        <div 
            className="Home"
            onContextMenu={(e) => {
                e.preventDefault();
                setClicked(true);
                setPoints({
                  x: e.pageX,
                  y: e.pageY,
                });
            }}
        >
            
            <CarouselComponent images={imagesArray} time="2"/>
            {clicked && (
                <ContextMenu top={points.y} left={points.x}>
                    <ul>
                        <li onClick={navigateToAdminDashboard}>Go to Admin Dashboard</li>
                    </ul>
                </ContextMenu>
            )}
        </div>
    )
}

export default HomePage;