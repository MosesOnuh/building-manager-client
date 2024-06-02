import { format, parseISO } from "date-fns";

export const GetDate = (dateParam) => {
  const date = new Date(dateParam);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-NG', options);
};


export const ApiDateFormat = (dateParam) => {
 // Split the input date into year, month, and day
    const [year, month, day] = dateParam.split('-');

    // Create a new Date object with the given year, month (minus 1 because months are 0-indexed), and day
    const convertedDate = new Date(year, month - 1, day);

    // Format the date as desired: yyyy-mm-ddT00:00:00
    const formattedDate = convertedDate.toISOString().split('T')[0] + 'T00:00:00';

    return formattedDate;
}