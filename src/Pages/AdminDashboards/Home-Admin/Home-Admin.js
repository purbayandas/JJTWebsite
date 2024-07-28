import aws from "aws-sdk";
import CardComponent from "../../../Components/Card/Card";
import { useState, useEffect } from "react";
import DynamicProgressBarsComponent from "../../../Components/ProgressBar/DynamicProgressBars";


aws.config.update({
    secretAccessKey: process.env.REACT_APP_ACCESS_SECRET,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    region: process.env.REACT_APP_REGION,
    // Note: 'bucket' is not a valid AWS SDK configuration property
});

const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
const s3 = new aws.S3();

async function importImages(section){
    let picturesURLsArray = [];

    async function getPicsFromS3(){
        const response = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix: section }).promise();
        
        return response;
    }
    console.log(await getPicsFromS3());
    const picturesArray = (await getPicsFromS3()).Contents;
    
    const picturesKeysArray = picturesArray.map(function (picture){
        if (picture.Key[picture.Key.length-1] !== "/"){
            return {fileName: picture.Key, lastModified: picture.LastModified}
        }
        else{
            return null
        }
        
    }).filter(function(element){
        return element !== null;
    });  
    
    
    
    picturesURLsArray = picturesKeysArray.map(function(image){
        return {
            URL: `https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/${image.fileName}`,
            fileName: image.fileName,
            lastModified: image.lastModified
        }
    });


    return picturesURLsArray;  
} 



function Home_Admin_Page(){


    const [displayImagesArray, setDisplayImagesArray] = useState([]);
    
    useEffect(() => {
        const fetchAndSetImagesArray = async function(){
        const imagesArrayHolder = await importImages("Home_Page");
        setDisplayImagesArray(imagesArrayHolder);
        }
        fetchAndSetImagesArray();
    },[]);

    // Create state to store files and their upload progress
  const [files, setFiles] = useState({});
  const [statesArray, setStatesArray] = useState([]);

  // Function to handle file change and initialize statesArray
  const handleFileChange = (e) => {
    setFiles(e.target.files);
    const numberOfFiles = e.target.files.length;
    const init_statesArray = Array(numberOfFiles).fill(0);
    setStatesArray(init_statesArray);
  };

  // Function to upload file to s3
  const uploadFile = async () => {
    // S3 Credentials
    aws.config.update({
      secretAccessKey: process.env.REACT_APP_ACCESS_SECRET,
      accessKeyId: process.env.REACT_APP_ACCESS_KEY,
      region: process.env.REACT_APP_REGION,
    });

    const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
    const s3 = new aws.S3();

    for (let fileNumber in files) {
      if (!isNaN(fileNumber)) {
        let file = files[fileNumber];

        // File Parameters
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Home_Page/${file.name}`,
          Body: file,
        };

        // Uploading file to s3
        var upload = s3
        .putObject(params)                      
        .on("httpUploadProgress", (evt) => {
          // File uploading progress          
          let uploadProgress = parseInt((evt.loaded * 100) / evt.total);
          setStatesArray(prevStates => {
            const tempStatesArray = [...prevStates];
            tempStatesArray[fileNumber] = uploadProgress;
            return tempStatesArray;
          });
        }).promise();

        await upload;
      }
    }
  };



    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "50vh", width: "50vw"}}>
                    <input type="file" onChange={handleFileChange} name='files[]' multiple />
                    <button onClick={uploadFile}>Upload</button>
                    <DynamicProgressBarsComponent currentUploadPercentStates={statesArray} />
                </div>
            </div>

        <div style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "1rem"
        }}>
            {displayImagesArray.map((image, index) => {
                return (
                    <div>
                        <CardComponent 
                            path={image.URL}
                            cardTitle={image.fileName}
                            cardText={image.lastModified.toString()}
                            memberID={index}
                            size="15rem"
                        />
                    </div>
                )

            })
            
            }
        </div>


        </div>
        
    )

}
export default Home_Admin_Page;