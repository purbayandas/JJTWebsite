import React, { useEffect, useState } from "react";
import NavBarComponent from "../../Components/Navbar/Navbar";
import CarouselComponent from "../../Components/SlidesCarousel/Carousel";
import CardComponent from "../../Components/Card/Card";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import aws from "aws-sdk";

const section = "About_Us"
// require("dotenv").config({ path: '../../../src/.env' });
// const aws = require("aws-sdk");



aws.config.update({
    secretAccessKey: process.env.REACT_APP_ACCESS_SECRET,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    region: process.env.REACT_APP_REGION,
    // Note: 'bucket' is not a valid AWS SDK configuration property
});

const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
const s3 = new aws.S3();

const pathMembers = "../../Images/AboutUs/Members"
const members = [
    {
        name: "Purbayan Das",
        memberID: 1,
        role: ["Lead Guitar", "Backing Vocals"],
        description: "Blah",
        image: "https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/About_Us_DP/PD.png"
    },

    {
        name: "Saikat Talukdar",
        memberID: 2,
        role: ["Backing Vocals", "Keyboards"],
        description: "Blah",
        image: "https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/About_Us_DP/SaikatT.png"
    },

    {
        name: "Koushik Bhattacharjee",
        memberID: 3,
        role: ["Lead Vocals"],
        description: "Blah",
        image: "https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/About_Us_DP/jd2.jpg"
    },

    {
        name: "Siddhartha Chatterjee",
        memberID: 4,
        role: ["Rhythm Guitar"],
        description: "Blah",
        image: "https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/About_Us_DP/sid4.jpg"
    }

];



function AboutUs(){
    const [openCarousel, setOpenCarousel] = useState(false);
    const [selectedMemberID, setSelectedMemberID] = useState(1);
    


useEffect(()=>{

    function closeCarousel(e){
        
        if ( e.target.classList.contains("card-img-top") === false && e.target.classList.contains("carousel-control-next-icon") === false && e.target.classList.contains("carousel-control-prev-icon") === false && e.target.getAttribute('src') === null && e.target.classList.contains("carousel-control-prev") === false && e.target.classList.contains("carousel-control-next") === false)
            setOpenCarousel(false);
            
    }

    document.addEventListener("click", closeCarousel);

    return function(){
        document.removeEventListener("click", closeCarousel)
    }
}, []);




function handleImageClick(event){
    setOpenCarousel(!openCarousel);
    
    setSelectedMemberID(event.currentTarget.classList[0]);
    
}
    const cardGrid = (
        <div className="AboutUs-members">
            <Row md={4} className="g-2 p-2 ms-4 ">
            {members.map((member, idx) => (                
                <Col key={idx}>
                    <CardComponent 
                        onClick={handleImageClick} 
                        path={member.image} 
                        cardTitle={member.name} 
                        cardText={member.role[0]} 
                        memberID={member.memberID}
                        size="20rem"
                    />
                </Col>
            ))}
            </Row>

        </div>
    
    
    )
    const [images, setImages] = useState([]);


    useEffect(() => {

        const imageTemporaryFetcher = async function (){
            let imagesHolder = await importImages(selectedMemberID);
            console.log("UseEffect is being triggered")
            setImages(imagesHolder);
        }
        imageTemporaryFetcher();

        
    },[openCarousel]);
    
    return (
        <div className="about-us-page">
                        
            {openCarousel ? 
            <div>
                <div className="d-flex justify-content-evenly">
                {cardGrid}
                </div>
                <CarouselComponent images={images} time="30" size="small"/> 
            </div>
            :
            <div className="d-flex justify-content-evenly">
                {cardGrid}
            </div>
            }
        </div>
    )
}

async function importImages(memberID){
    let memberPicturesURLsArray = [];
    async function getPicsFromS3(memberFolderName){
        const response = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: `${section}/${memberFolderName}/` }).promise();
        return response;
    }

    // console.log(memberID)
    // function importAll(r) {
        
    //     let images={};
    //     r.keys().forEach((filename, index) => { 
    //         const imageName = filename.replace('./', '');            
    //         images[imageName] = r(filename);
    //       });
    //     return images;
    // }

    const memberName = members.find(function(member){
        return member.memberID == memberID;        
    }).name;

    const memberFolderName = memberName.split(" ").join("_");

    const memberPicturesArray = (await getPicsFromS3(memberFolderName)).Contents;

    const memberPicturesKeysArray = memberPicturesArray.map(function (picture){
        if (picture.Key[picture.Key.length-1] !== "/"){
            return picture.Key;
        }
    }).filter(function(element){
        return element !== undefined;
    });

    
    


    memberPicturesURLsArray = memberPicturesKeysArray.map(function(key){
        return `https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/${key}`
    });

    return memberPicturesURLsArray;    
      
    //   if (memberID == 1){
    //     console.log("Purbayan Clicked");
    //     return importAll(require.context(`../../Images/AboutUs/Members/Purbayan`, false, /\.(png|jpe?g|svg)$/));

    //   }
    //   if (memberID == 2){
    //     console.log("Saikat Clicked");
    //    return importAll(require.context(`../../Images/AboutUs/Members/Saikat`, false, /\.(png|jpe?g|svg)$/));

    //   }
    //   if (memberID == 3){
    //     console.log("Koushik Clicked");
    //     return importAll(require.context(`../../Images/AboutUs/Members/Koushik`, false, /\.(png|jpe?g|svg)$/));

    //   }
    //   if (memberID == 4){
    //     console.log("Siddharta Clicked");
    //     return importAll(require.context(`../../Images/AboutUs/Members/Siddharta`, false, /\.(png|jpe?g|svg)$/));

    //   }
      
    
}

export default AboutUs;