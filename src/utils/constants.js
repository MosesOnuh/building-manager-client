

export const paginationPageSize = 8;
// export const accessToken = "tokenA";
// export const refreshToken = "tokenR";
export const accessToken = "accessToken";
export const refreshToken = "refreshToken";

// export const constructionPhases = {
//     PreConstruction: 1,
//     Construction: 2,
//     PostConstruction: 3,
// }

export const constructionPhasesValue = {
    1 : "Pre-Construction",
    2 : "Construction",
    3 : "Post-Construction",
}

export const userProfession = {
    1 : 'Client',
    2 : 'Project Manager',
    3 : 'Architect',
    4 : 'SiteEngineer',
    5 : 'StructuralEngineer',
    6 : 'MandE_Engineer',
    7 : 'QuantitySurveyor',
    8 : 'LandSurveyor',        
    9 : 'BrickLayer',
    10 : 'Iron Bender',
    11 : 'Technician',
    12 : 'Labourer',
    13 : 'Others'
}

export const activityStatus = {
    1 : 'Pending',
    2 : 'Approved',
    3 : 'Rejected',
    4 : 'Done'
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

 