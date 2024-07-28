import { useState } from "react";
import ProgressBarComponent from "./ProgressBar";



function DynamicProgressBarsComponent({currentUploadPercentStates}){
          
    return (
        currentUploadPercentStates.map((currentUploadPercent, index) => {
            console.log("bar for file "+index+" is being loaded with current upload percent - "+currentUploadPercent);
            return (
                <div key={index}>
                    <ProgressBarComponent now={currentUploadPercent}/>
                </div>

            )
            

        })
    )
}

export default DynamicProgressBarsComponent;