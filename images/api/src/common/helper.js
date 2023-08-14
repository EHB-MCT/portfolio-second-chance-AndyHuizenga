


function convertMilesToKilometers(miles) {
 
  if(typeof miles == "number") {
    return Math.abs(miles * (1.61))
  }
 
  return undefined;
};

module.exports = {
  convertMilesToKilometers
};