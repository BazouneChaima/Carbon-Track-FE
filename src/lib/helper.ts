import  React,{useState} from 'react';
import { Data } from '@/types/data';
import { LegendToggle } from '@mui/icons-material';
import { format } from 'date-fns';
import dayjs from 'dayjs'

export function getEmissionsByLocation(

  data: { Date: string; emission_tracker: number }[],
  searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom',
  startDate?: Date,
  endDate?: Date
) {
  const today = new Date();

  let filteredData: { Date: string; emission_tracker: number }[] = [];
  let threshold: Date, formattedThreshold: string;

  switch (searchDays) {
    case '7days':
      threshold = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      console.log("filteredData",formattedThreshold.length,filteredData)
      break;

    case '30days':
      threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      break;

    case 'quarter':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
      });
      break;

    case '12months':
      filteredData = data.filter((item) => new Date(item.Date).getFullYear() === today.getFullYear());
      break;

    
  }
  if (startDate && endDate) {
 
    filteredData = data.filter((item) => {
      const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
      return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && itemDate <= dayjs(endDate).format('YYYY-MM-DD');
    });
    console.log("start end emissionsByLocation",startDate,endDate,filteredData)
  } 
  const emissionsByLocation = filteredData.reduce((acc, item) => {
    const emissionTrackerValid = item.emission_tracker !== '' && !isNaN(item.emission_tracker);
    const quantityValid = item.quantity !== '' && !isNaN(item.quantity);

    if (emissionTrackerValid && quantityValid && item.location) {
      const emissions = item.quantity * item.emission_tracker;
      
      if (acc[item.location]) {
        acc[item.location] += emissions;
      } else {
        acc[item.location] = emissions;
      }
    }
    return acc;
  }, {});
console.log("emissionsByLocation",emissionsByLocation)
  // Convert object to array and sort by emission values in descending order
  const sortedLocations = Object.entries(emissionsByLocation)
    .map(([location, emissions]) => ({ location, emissions }))
    .sort((a, b) => b.emissions - a.emissions);

  // Get the first 5 locations with highest emissions
  const top5Locations = sortedLocations.slice(0, 5);

  // Format result to label-value format
  const result = top5Locations.map(({ location, emissions }) => ({
    label: location,
    value: emissions,
  }));

  return result;
}



export function getFootPrint(
  
  data: { Date: string; emission_tracker: number }[],
  searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom',
  startDate?: Date,
  endDate?: Date



) {


  const today = new Date();

  let filteredData: { Date: string; emission_tracker: number }[] = [];
  let threshold: Date, formattedThreshold: string;

  switch (searchDays) {
    case '7days':
      threshold = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      console.log("filteredData",formattedThreshold.length,filteredData)
      break;

    case '30days':
      threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      break;

    case 'quarter':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
      });
      break;

    case '12months':
      filteredData = data.filter((item) => new Date(item.Date).getFullYear() === today.getFullYear());
      break;

    
  }
  if (startDate && endDate) {
 
    filteredData = data.filter((item) => {
      const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
      return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && itemDate <= dayjs(endDate).format('YYYY-MM-DD');
    });
    console.log("start end",startDate,endDate,filteredData)
  }

  const emissionsByCategory = filteredData.reduce((acc, item) => {
    const emissionTrackerValid = item.emission_tracker !== '' && !isNaN(item.emission_tracker);
    const quantityValid = item.quantity !== '' && !isNaN(item.quantity);

    if (emissionTrackerValid && quantityValid) {
      const emissions = item.quantity * item.emission_tracker;
      console.log("emissions==>", emissions, item.quantity, item.emission_tracker, item.category);
      
      if (acc[item.category]) {
        acc[item.category] += emissions;
      } else {
        acc[item.category] = emissions;
      }
    }
    return acc;
  }, {});

  const result = Object.entries(emissionsByCategory)
    .map(([category, value]) => ({
      label: category,
      value,
    }))
    .filter(item => item.label !== undefined && !isNaN(item.value));

  console.log("result==================>", result);
  return result;
}

export const filterByDate = (data: [],days: number) => {
  const today = new Date();
  const formatedToDay=dayjs(today).format('YYYY-MM-DD');

  const threshold = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  const formatedThreshold=dayjs(threshold).format('YYYY-MM-DD'); 
  
  let filters= data.filter((item) => {
    const itemDate = new Date(item.Date);
    return itemDate >= new Date(threshold) && itemDate <= new Date(today);
  });
  
      console.log("fieltes by dat=>",filters)
      return filters;
}; 
export function CalculateScopes(data: [], period: '7days' | '30days' | 'quarter' | '12months' | 'custom', startDate?: Date, endDate?: Date) {
  console.log('CalculateScopes===>',period,startDate,endDate)
  let filteredData=[];

  // Filter data based on the period or custom dates
  switch (period) {
    case '7days':
      filteredData=filterByDate(data, 7);
      break;
    case '30days':
      filteredData=filterByDate(data, 30)  
      break;
    case 'quarter':
      // Calculate start and end of current quarter
      const today = new Date();
      const currentQuarter = Math.floor((today.getMonth() / 3));
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      let filterQuarter= data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
      });
      filteredData=(filterQuarter);
      break;
    case '12months':
      // Filter data for the current year
      const currentYear = new Date().getFullYear();
      let filterYear = data.filter((item) => new Date(item.Date).getFullYear() === currentYear);
      filteredData=(filterYear);
      break;
    case 'custom': 
      if (startDate && endDate) {
        let filterTwoDates =data.filter((item) => {
          const itemDate = new Date(item.Date);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        })
        console.log("filterTwoDates",filterTwoDates)
        filteredData=(filterTwoDates)
        break;
      } 
      break;
     
      
  }

  // Calculate scopes based on filtered data
  let scope1 = filteredData.reduce((accumulator, element) => accumulator + (element.scope1 ?? 0), 0);
  let scope2 = filteredData.reduce((accumulator, element) => accumulator + (element.scope2 ?? 0), 0);
  let scope3 = filteredData.reduce((accumulator, element) => accumulator + (element.scope3 ?? 0), 0);

  // Calculate total sum
  const sum = scope1 + scope2 + scope3;

  // Normalize scopes to sum up to 100
  const sumPr = 100 / sum;
  scope1 *= sumPr;
  scope2 *= sumPr;
  scope3 *= sumPr;

  return { scope1, scope2, scope3, sum };
}


/* export function CalculateScopes(data: []) {
  //data.map((ite) => console.log(ite.scope1))
  let scope1 = data.reduce((accumulateur, element) => accumulateur + (element.scope1 ?? 0), 0);
  console.log('scope 1' + scope1);
  let scope2 = data.reduce((accumulateur, element) => accumulateur + (element.scope2 ?? 0), 0);
  let scope3 = data.reduce((accumulateur, element) => accumulateur + (element.scope3 ?? 0), 0);
  const sum = parseInt(scope1 + scope2 + scope3);
  const sumPr = 100 / sum;
  scope1 = scope1 * sumPr;
  scope2 = scope2 * sumPr;
  scope3 = scope3 * sumPr;
  return { scope1, scope2, scope3, sum };
} */

export function CalculateEmission(data: []) {
  let totalEmission = data.reduce(
    (accumulateur, element) => accumulateur + ((element.emission_tracker && parseFloat(element.emission_tracker)) ?? 0),
    0
  );
  return parseInt(totalEmission);
}
export function extractScops(data: []) {
  const scope1Arr = data.map((element) => element.scope1 ?? 0);
  const scope2Arr = data.map((element) => element.scope2 ?? 0);
  const scope3Arr = data.map((element) => element.scope3 ?? 0);
  return { scope1Arr, scope2Arr, scope3Arr };
}


/*  
export function getCarbonEmissionByCategory(data: [], searchScope:string,searchDays:string){
 
  const today = new Date();

  const filteredData = data.filter((item) => {
    if (searchScope === 'all') {
      return true;
    }
    return item[searchScope] && item[searchScope] > 0;
  });

  const filteredByDate = filteredData.filter((item) => {
    if (!item.date) {
      return false; // Skip items without a date field
    }

    const formattedDate = format(item.date, 'yyyy-MM-dd'); // Format for comparison

    if (searchDays === '7 days') {
      return new Date(formattedDate) >= new Date(format(today.getTime() - 7 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'));
    } else if (searchDays === 'Quarter') {
      const quarterStart = new Date(today.getFullYear(), 0, 1);
      if (today.getMonth() > 2) {
        quarterStart.setFullYear(quarterStart.getFullYear() + 1);
      }
      return new Date(formattedDate) >= quarterStart;
    } else if (searchDays === '30 Days') {
      return new Date(formattedDate).getFullYear() === today.getFullYear() && new Date(formattedDate).getMonth() === today.getMonth();
    } else if (searchDays === '12 Months') {
      return new Date(formattedDate).getFullYear() === today.getFullYear();
    } else {
      throw new Error(`Invalid searchDays: ${searchDays}`);
    }
  });

  const extractedData = filteredByDate.map((item) => ({
    category: item.category,
    emission_tracker: item.emission_tracker ?? 0,
    scope1: item.scope1,
    scope2: item.scope2,
    scope3: item.scope3,
  }));

  const summedData = extractedData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category] += item.emission_tracker || 0; // Handle missing emission_tracker
    return acc;
  }, {} as Record<string, number>);

  const result = Object.entries(summedData).map(([category, value]) => ({
    label: category,
    value,
  }));
  console.log("search carbon emission",result)
  return result;
} */

/*  export function getCarbonEmissionByCategory(
 

  data: { Date: string; emission_tracker: number }[],
  searchScope:'scope1' | 'scope2' | 'scope3' ,
  searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom',
  startDate?: Date,
  endDate?: Date

) {
  console.log("getCarbonEmissionByCategory",searchScope,searchDays,startDate,endDate)
  const today = new Date();
  let filteredData=[];
  if(searchScope==="all"){
     
    filteredData=data;
  }else{ 
    filteredData = data.filter((item) => {
      const scopes = ['scope1', 'scope2', 'scope3'];
      const validScopes = scopes.filter((scope) => Object.keys(item).includes(scope));
      const maxScopeValue = validScopes.length > 0 ? Math.max(...validScopes.map((scope) => item[scope])) : 0;
    
      return Object.keys(item).includes(searchScope) &&
             item[searchScope] > 0 &&
             item[searchScope] >= maxScopeValue;
    });
  }    
  console.log("filter by scope===>",filteredData)
  const extractedData = filteredData.map((item) => ({
    category: item.category,
    emission_tracker: (item.emission_tracker && parseInt(item.emission_tracker)) ?? 0,
    scope1:item.scope1,
    scope2:item.scope2,
    scope3:item.scope3,
     
  })); 
  const summedData = extractedData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category] += item.emission_tracker;
    return acc;
  }, {});

  // Step 3: Transform the summed data into the desired format
  const result = Object.entries(summedData).map(([category, value]) => ({
    label: category,
    value,
  })); 
  console.log("category=>",result)

  return result;
}   */

  export function getCarbonEmissionByCategory(
 

    data: { Date: string; emission_tracker: number }[],
  
    searchScope:string, 
    searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom',
    startDate?: Date,
    endDate?: Date
  
  ) {
    const today = new Date();
  
    let filteredData: { Date: string; emission_tracker: number }[] = [];
    let threshold: Date, formattedThreshold: string;
  
    switch (searchDays) {
      case '7days':
        threshold = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        formattedThreshold = threshold.toISOString().split('T')[0];
        if(searchScope=='all'){
          filteredData = data.filter(
            (item) =>
              dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
              dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD') 
          );
        }else{
        filteredData = data.filter(
          (item) =>
            dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
            dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD') &&
            Object.keys(item).includes(searchScope) && item[searchScope] > 0
        );
      }
       
        break;
  
      case '30days':
        threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        formattedThreshold = threshold.toISOString().split('T')[0];
        if(searchScope=='all'){
          filteredData = data.filter(
            (item) =>
              dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
              dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')  
          );
        }else{
        filteredData = data.filter(
          (item) =>
            dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
            dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')  &&
            Object.keys(item).includes(searchScope) && item[searchScope] > 0
        );
      }
        break;
  
      case 'quarter':
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        if(searchScope=='all'){
          filteredData = data.filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate >= quarterStart && itemDate <= quarterEnd ;
          });
        }else{

        
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.Date);
          return itemDate >= quarterStart && itemDate <= quarterEnd &&  
          Object.keys(item).includes(searchScope) && item[searchScope] > 0;
        });
      }
        break;
  
      case '12months':
        if(searchScope=='all'){
          filteredData = data.filter((item) => (new Date(item.Date).getFullYear() === today.getFullYear()
           )
        );
        }else{
        filteredData = data.filter((item) => (new Date(item.Date).getFullYear() === today.getFullYear()
        &&
        Object.keys(item).includes(searchScope) && item[searchScope] > 0)
      );
    }
        break;
  
      
    }
    if (startDate && endDate) {
      if(searchScope=='all'){
      filteredData = data.filter((item) => {
        const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
        return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && 
                    itemDate <= dayjs(endDate).format('YYYY-MM-DD') ;
      });
    }else{
      filteredData = data.filter((item) => {
        const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
        return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && 
                    itemDate <= dayjs(endDate).format('YYYY-MM-DD')  &&
                    Object.keys(item).includes(searchScope) && item[searchScope] > 0;
      });
      
    }
      console.log("start end",startDate,endDate,filteredData)
    } 
    
     
   
    const extractedData = filteredData.map((item) => ({
      category: item.category,
      emission_tracker: (item.emission_tracker && parseInt(item.emission_tracker)) ?? 0,
      scope1:item.scope1,
      scope2:item.scope2,
      scope3:item.scope3,
       
    })); 
    const summedData = extractedData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.emission_tracker;
      return acc;
    }, {});
  
    console.log("extractedDataextractedData",extractedData,summedData)
    // Step 3: Transform the summed data into the desired format
    const result = Object.entries(summedData).map(([category, value]) => ({
      label: category,
      value,
    })); 
    console.log("result==>",result)
    return result;
  }  
//export function CalculateScopes(data: [], period: '7days' | '30days' | 'quarter' | '12months' | 'custom', startDate?: Date, endDate?: Date) {
export function getCarbonEmission(data: [],searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom', startDate?: Date, endDate?: Date) {
  const today = new Date();
  
  let filteredData=[]; 
  let threshold,formattedThreshold;
  switch (searchDays) {
    case '7days': 
     threshold = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
     formattedThreshold = threshold.toISOString().split('T')[0];
       filteredData=
              data.filter(
                (item) => (dayjs(item.Date).format('YYYY-MM-DD')> formattedThreshold
              && dayjs(item.Date).format('YYYY-MM-DD')<= dayjs(today).format('YYYY-MM-DD')
              )
              )
        return filteredData.map( item => {
          return item.emission_tracker ;
        });       
      
      break;

    case '30days': 
     threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    formattedThreshold = threshold.toISOString().split('T')[0];
    filteredData=
              data.filter(
                (item) => (dayjs(item.Date).format('YYYY-MM-DD')> formattedThreshold
              && dayjs(item.Date).format('YYYY-MM-DD')<= dayjs(today).format('YYYY-MM-DD')
              )
              )
        return filteredData.map( item => {
          return item.emission_tracker ;
        }); 
    break;
    case 'quarter':
      // Calculate start and end of current quarter
      const currentQuarter = Math.floor((today.getMonth() / 3));
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        console.log("quarter start and end",quarterStart,quarterEnd,currentQuarter)
      // Filter data for the current quarter
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
      });
      console.log("filteredData qurater",filteredData)
      return filteredData.map( item => {
        return item.emission_tracker ;
      }); 
      break;
       case '12months':
      filteredData= data.filter((item) => new Date(item.Date).getFullYear() === today.getFullYear());
      return filteredData.map( item => {
        return item.emission_tracker ;
      }); 
      break;
      
     
  }
  
  if (startDate && endDate) {
    let filterTwoDates =data.filter((item) => {
      const itemDate = new Date(item.Date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    })
    console.log("test",filterTwoDates.map( item => {
      return item.emission_tracker ;
    }))
    return filterTwoDates.map( item => {
      return item.emission_tracker ;
    }); 
    
  }


}

export function getCarbonEmissionFromTarget(data: []) {

    console.log("getCarbonEmissionFromTarget",data)
  return data.map( item => {
    console.log(item.emissionReduction)
    return item.emissionReduction ;
  });
}
export const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0 || Object.values(obj).every((value) => !value);
};
export const isEmptyArray = (array: any) => {
  return array.every((item) => {
    // Check for different empty values
    return (
      item === '' ||
      item === null ||
      item === undefined ||
      (typeof item === 'string' && item.trim() === '') ||
      item === false
    );
  });
};
export const FilterEmptyRow = (data: []) => {
  return data.filter((item) => !isEmpty(item));
};

export const ContainKey = (obj: object, key: string) => {
  return key in obj;
};

export const HasAllKeys = (obj: object, keys: string[]) => {
  for (let key of keys) {
    if (!obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const genImageUrl = (url: string) => {
  const blob = new Blob([url], { type: 'image/jpeg' });
  console.log({ blob });
  const imageUrl = URL.createObjectURL(blob);
  return imageUrl;
};
export const calculateDATA = (data: Data[], date, category, location) => {
  const result = data.find((element) => {
    if (
      element.date == date &&
      element.category == category &&
      element.location == location &&
      element.source !== 'Bulk Upload'
    ) {
      return true; // This will cause `find` to return this element
    }
    return false;
  });
  // console.log('result==> '+ JSON.stringify(result.emission_tracker))
  return result
    ? {
        emission_tracker: result.emission_tracker,
        scope1: result.scope1,
        scope2: result.scope2,
        scope3: result.scope3,
      }
    : {
        emission_tracker: 0,
        scope1: 0,
        scope2: 0,
        scope3: 0,
      };
};


export function getCarbonPerFilterCard(
  data: { Date: string; emission_tracker: number }[],
  searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom',
  startDate?: Date,
  endDate?: Date
) {
  const today = new Date();

  let filteredData: { Date: string; emission_tracker: number }[] = [];
  let threshold: Date, formattedThreshold: string;

  switch (searchDays) {
    case '7days':
      threshold = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      console.log("filteredData",formattedThreshold.length,filteredData)
      break;

    case '30days':
      threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      break;

    case 'quarter':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
      });
      break;

    case '12months':
      filteredData = data.filter((item) => new Date(item.Date).getFullYear() === today.getFullYear());
      break;

    
  }
  if (startDate && endDate) {
 
    filteredData = data.filter((item) => {
      const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
      return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && itemDate <= dayjs(endDate).format('YYYY-MM-DD');
    });
    console.log("start end",startDate,endDate,filteredData)
  }
  // Calculate the total sum of valid emission_tracker values
  const validValues = filteredData
  .filter((item) => !isNaN(item.emission_tracker)) // Filter out NaN before map
  .map((item) => +item.emission_tracker);

const totalSum = validValues.reduce((sum, item) => sum + item, 0); // Use reduce for sum

  //reduce((accumulator, element) => accumulator + (element.scope1 ?? 0), 0);

  console.log("totalSum",validValues,totalSum)
  // Calculate the average, handling the case where validValues length is 0
  const average = validValues.length > 0 ? totalSum / validValues.length : 0;
  console.log("average",average,validValues.length,totalSum)
  return average.toFixed(3);
}



export function getEmissionPerFilterCard(
  data: { Date: string; emission_tracker: number }[],
  searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom',
  startDate?: Date,
  endDate?: Date
) {
  const today = new Date();

  let filteredData: { Date: string; emission_tracker: number }[] = [];
  let threshold: Date, formattedThreshold: string;

  switch (searchDays) {
    case '7days':
      threshold = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      console.log("filteredData",formattedThreshold.length,filteredData)
      break;

    case '30days':
      threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      break;

    case 'quarter':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
      });
      break;

    case '12months':
      filteredData = data.filter((item) => new Date(item.Date).getFullYear() === today.getFullYear());
      break;

    
  }
  if (startDate && endDate) {
 
    filteredData = data.filter((item) => {
      const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
      return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && itemDate <= dayjs(endDate).format('YYYY-MM-DD');
    });
    console.log("start end",startDate,endDate,filteredData)
  }
  // Calculate the total sum of valid emission_tracker values
  const validValues = filteredData
  .filter((item) => !isNaN(item.emission_tracker)) // Filter out NaN before map
  .map((item) => +(item.emission_tracker * item.quantity));

const totalSum = validValues.reduce((sum, item) => sum + item, 0); // Use reduce for sum

  //reduce((accumulator, element) => accumulator + (element.scope1 ?? 0), 0);

  console.log("totalSum",validValues,totalSum)
  // Calculate the average, handling the case where validValues length is 0
  const average = validValues.length > 0 ? totalSum / validValues.length : 0;
  console.log("average",average,validValues.length,totalSum)
  return average.toFixed(3);
}


export function getCarbonEmissionScopesChart(
  data: { Date: string; emission_tracker: number }[],
  searchDays: '7days' | '30days' | 'quarter' | '12months' | 'custom',
  startDate?: Date,
  endDate?: Date
) {
    const today = new Date();

  let filteredData: { Date: string; emission_tracker: number }[] = [];
  let threshold: Date, formattedThreshold: string;

  switch (searchDays) {
    case '7days':
      threshold = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      console.log("filteredData",formattedThreshold.length,filteredData)
      break;

    case '30days':
      threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')
      );
      break;

    case 'quarter':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
      });
      break;

    case '12months':
      filteredData = data.filter((item) => new Date(item.Date).getFullYear() === today.getFullYear());
      break;

    
  }
  if (startDate && endDate) {
 
    filteredData = data.filter((item) => {
      const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
      return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && itemDate <= dayjs(endDate).format('YYYY-MM-DD');
    });
    console.log("start end",startDate,endDate,filteredData)
  } 
/*   const validValues = filteredData
  .filter((item) => !isNaN(item.emission_tracker)) 
  .map((item) => +(item.emission_tracker * item.quantity)); */

  const scope1Arr = filteredData.map((element) => element.scope1 ?? 0);
  const scope2Arr = filteredData.map((element) => element.scope2 ?? 0);
  const scope3Arr = filteredData.map((element) => element.scope3 ?? 0);

  console.log("scope1Arr==>",scope1Arr,scope2Arr,scope3Arr)
 
 

/* const totalSum1 = scope1Arr.reduce((sum, item) => sum + item, 0);
const totalSum2 = scope2Arr.reduce((sum, item) => sum + item, 0);
const totalSum3 = scope3Arr.reduce((sum, item) => sum + item, 0);  

  console.log("totalSum",validValues,totalSum) 
  const average = validValues.length > 0 ? totalSum / validValues.length : 0;
  console.log("average",average,validValues.length,totalSum)
  return average.toFixed(3); */




return  { scope1Arr,scope2Arr,scope3Arr } 
 
  

}