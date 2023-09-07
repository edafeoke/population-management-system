
const customResponseObject = (
    res, 
    message, 
    statusCode, 
    otherFields=null
  ) => {
    if (otherFields) {
      return res.status(statusCode).json({ message, ...otherFields });
    }
    return res.status(statusCode).json({ message });
  };

export default customResponseObject;
