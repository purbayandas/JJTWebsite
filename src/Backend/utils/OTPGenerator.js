function OTPGenerator(){
    const randomnumber = Math.random()*1000000;
    let OTP = randomnumber.toString().split(".")[0].toString()
    if (OTP.length != 6){
        for (let i=0; i<6-OTP.length; i++){
            OTP = "0"+ OTP;
        }
    }
    return OTP;
}

module.exports = OTPGenerator;