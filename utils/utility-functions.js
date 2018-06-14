exports.valueInArray = (value, anArray) => {
    if (anArray.length == 0)
    {
	return false;
    }
    for (let i = 0; i < anArray.length; ++i)
    {
	if (anArray[i]['_id'].equals(value))
	{
	    return true;
	    break;
	}   
    }
    return false;
}
