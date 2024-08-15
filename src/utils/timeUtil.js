import { format, parseISO } from "date-fns";

export const GetDate = (dateParam) => {
  const date = new Date(dateParam);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-NG', options);
};

export const GetDateAndTime = (dateParam) => {
  const date = new Date(dateParam);

  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-NG', options);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;

  const formattedTime = `${hours}:${strMinutes} ${ampm}`;

  return `${formattedDate}, ${formattedTime}`;
};

export const ApiDateFormat = (dateParam) => {
 // Split the input date into year, month, and day
    const [year, month, day] = dateParam.split('-');
    let formattedDate = `${year}-${month}-${day}T00:00:00`;
    return formattedDate;
}

