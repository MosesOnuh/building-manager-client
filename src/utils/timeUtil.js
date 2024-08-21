import { parseISO, set, format } from 'date-fns';

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

// export const EndDateFormatter = (dateParam) => {

//   let endDate = new Date(dateParam);

//   // Set end date to 11:59 PM local time
//   endDate = setHours(setMinutes(setSeconds(setMilliseconds(endDate, 999), 59), 59), 23);

//   // Format endDate as "YYYY-MM-DD HH:MM"
//   const formattedEndDate = format(endDate, 'yyyy-MM-dd HH:mm');
//   return formattedEndDate;
// }

// export const ChartEndDateFormatter = (data) => {
//   return data.map(item => {
//     // Parse the endDate to a Date object
//     const endDate = parseISO(item.endDate);

//     // Set end date to 11:59 PM local time
//     const updatedEndDate = set(endDate, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });

//     // Format endDate as "YYYY-MM-DD HH:MM"
//     const formattedEndDate = format(updatedEndDate, 'yyyy-MM-dd HH:mm');

//     return {
//       ...item,
//       endDate: formattedEndDate
//     };
//   });
// }


export const ChartEndDateFormatter = (data) => {
  return data.map(item => {
    // Parse the endDate to a Date object
    const endDate = parseISO(item.endDate);

    // Set end date to 11:59 PM local time
    const updatedEndDate = set(endDate, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });

    // Format endDate as "YYYY-MM-DD HH:mm"
    const formattedEndDate = format(updatedEndDate, 'yyyy-MM-dd HH:mm');

    return {
      ...item,
      endDate: formattedEndDate
    };
  });
}
