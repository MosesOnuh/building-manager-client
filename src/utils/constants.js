

export const paginationPageSize = 8;
export const accessToken = "accessToken";
export const refreshToken = "refreshToken";
export const memberProjectAccess = {
  unBlock : 1,
  block : 2
}

export const networkErr = "Network error occurred, check your internet";

export const constructionPhasesValue = {
    1 : "Pre-Construction",
    2 : "Construction",
    3 : "Post-Construction",
}

export const constructionPhases = [
  { label: 'Pre-Construction',  value: "1", },
  { label: 'Construction',  value: "2", },
  { label: 'Post-Construction',  value: "3", },
]

// export const userProfession = {
//     1 : 'Client',
//     2 : 'Project Manager',
//     3 : 'Architect',
//     4 : 'SiteEngineer',
//     5 : 'StructuralEngineer',
//     6 : 'MandE_Engineer',
//     7 : 'QuantitySurveyor',
//     8 : 'LandSurveyor',        
//     9 : 'BrickLayer',
//     10 : 'Iron Bender',
//     11 : 'Technician',
//     12 : 'Labourer',
//     13 : 'Others'
// }
export const userProfession = {
    1 : 'Client',
    2 : 'Project Manager',
    3 : 'Architect',
    4 : 'Site Engineer',
    5 : 'Structural Engineer',
    6 : 'MandE Engineer',
    7 : 'Quantity Surveyor',
    8 : 'Land Surveyor',        
    9 : 'Brick Layer',
    10 : 'Iron Bender',
    11 : 'Technician',
    12 : 'Labourer',
    13 : 'Others'
}

export const ProjectProfessionals = [
    { label: 'Client',  value: 1, },
    { label: 'Project Manager', value: 2 },
    { label: 'Architect', value: 3 },
    { label: 'Site Engineer', value: 4 },
    { label:  'Structural Engineer', value: 5},
    { label: 'M&E Engineer', value: 6 },
    { label: 'Quantity Surveyor', value: 7 },
    { label: 'Land Surveyor', value: 8 },
    { label: 'Bricklayer', value: 9},
    { label: 'Iron Bender' , value: 10 },
    { label: 'Technician', value: 11 },
    { label: 'Labourer', value: 12  },
    { label: 'Others', value: 13 }
];

export const ProfessionalColors = [
    "#377EB8", // Royal Blue
    "#FF7F0E", // Orange
    "#4DAF4A", // Green
    "#9D38BD", // Purple
    "#E06666", // Red
    "#F7CA1F", // Yellow
    "#FFC0CB", // Pink
    "#70AD47", // Forest Green
    "#A9A9A9", // Light Gray
    "#C5B035", // Bronze
    "#6699FF", // Light Blue
    "#D62728", // Maroon
    "#9467BD", // Purple Plum
  ];

export const activityStatus = {
    1 : 'Pending',
    2: 'Awaiting Approval',
    3 : 'Approved',
    4 : 'Rejected',
    5 : 'Done'
}

//this might cause error
export const activityStatusKey = {
    Pending : 1,
'Awaiting Approval': 2,
    Approved : 3,
    Rejected : 4,
    Done : 5
}

export const paymentRequestStatus = {
    1 : 'Pending',
    2 : 'Awaiting Confirmation',
    3 : 'Confirmed',
    4 : 'Rejected'
}

export function generateNewArray(items) {
      return items.map((item) => {
        const {
          activityId,
          firstName,
          lastName,
          profession,
          startDate,
          endDate,
        } = item;

        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);
        const today = new Date();
        let durationInMilliseconds;

        if (formattedEndDate < formattedStartDate) {
          // If end date is before start date, set duration to 0
          durationInMilliseconds = 0;
        } else if (today < formattedStartDate) {
          // If today is before start date, set duration to 0
          durationInMilliseconds = 0;
        } else if (
          today.getTime() === formattedStartDate.getTime() &&
          today.getHours() < formattedEndDate.getHours()
        ) {
          // If today's date is the same as the start date and the time of today is before the time of end date, calculate percentage
          durationInMilliseconds = today - formattedStartDate;
        } else if (today > formattedEndDate) {
          // If today is after end date, set duration to total duration and percentage done to 100%
          durationInMilliseconds = formattedEndDate - formattedStartDate;
        } else {
          // If today is between start date and end date, calculate partial duration
          durationInMilliseconds = today - formattedStartDate;
        }

        const totalDurationInMilliseconds =
          formattedEndDate - formattedStartDate;
        let percentageDone;

        if (today >= formattedEndDate) {
          percentageDone = 100;
        } else {
          percentageDone =
            (durationInMilliseconds / totalDurationInMilliseconds) * 100;
        }

        return [
          activityId,
          `${item.activityName}: ${firstName} ${lastName}`,
          userProfession[profession],
          formattedStartDate,
          formattedEndDate,
          null,
          percentageDone,
          null,
        ];
      });
    }

export  const AddSerialNumber = (itemList, currentPage, PageSize) => {
  return itemList.map((item, index) =>{
    let num = index++ + 1
    let sN = (currentPage - 1) * PageSize + num++ ;
    return {
      serialNumber: sN,
      ...item,
    };
  })
}

export const formatAmount = (number) => {
 if (typeof number !== 'number') {
    return 'Invalid input';
  }

  // Convert the number to a string with two fixed decimal places
  const [integerPart, decimalPart] = number.toFixed(2).split('.');

  // Format the integer part with commas
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Combine the formatted integer part and the decimal part if needed
  if (decimalPart === '00') {
    return formattedIntegerPart;
  } else {
    return `${formattedIntegerPart}.${decimalPart}`;
  }
};

export const calculateTotalByMultiplication = (quantity, price) => {
  // Convert price to kobo (cents equivalent) to avoid floating-point issues
  const priceInKobo = Math.round(price * 100);
  const totalInKobo = Math.round(quantity * priceInKobo);

  // Convert back to Naira
  const totalInNaira = totalInKobo / 100;

  return totalInNaira.toFixed(2); // Ensure two decimal places for currency representation
}


export const addNairaKobo = (amounts) => {
  // Convert each amount to kobo and sum them
  const totalKobo = amounts.reduce((total, amount) => {
    // Convert amount to kobo
    const kobo = Math.round(amount * 100);
    return total + kobo;
  }, 0);

  // Convert total kobo back to Naira
  const totalNaira = totalKobo / 100;

  return totalNaira.toFixed(2); // Ensure two decimal places for currency representation
};

export function getNumberOfWeeksInMonth(year, month) {
   // Create a Date object for the first day of the month
  const firstDay = new Date(year, month - 1, 1);

  // Create a Date object for the last day of the month
  const lastDay = new Date(year, month, 0);

  // Get the day of the week for the first day of the month (0-6, Sunday-Saturday)
  const firstDayOfWeek = firstDay.getDay();

  // Get the day of the week for the last day of the month (0-6, Sunday-Saturday)
  const lastDayOfWeek = lastDay.getDay();

  // Calculate the number of days in the month
  const daysInMonth = lastDay.getDate();

  // Calculate the number of days from the first day to the end of the first week
  const daysInFirstWeek = 7 - firstDayOfWeek;

  // Calculate the number of full weeks in the month (excluding the first and last weeks)
  const fullWeeks = Math.floor((daysInMonth - daysInFirstWeek - (6 - lastDayOfWeek)) / 7);

  // Calculate the number of days in the last week
  const daysInLastWeek = lastDayOfWeek + 1;

  // Calculate the total number of weeks
  const totalWeeks = 1 + fullWeeks + (daysInLastWeek > 0 ? 1 : 0);

  return totalWeeks;
}


export const generalMessage = "An error occurred. Try Again"

 