import { Data } from '@/types/data';

export function getEmissionsByLocation(data = []) {
  const emissionsByLocation = data.reduce((acc, item) => {
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



export function getFootPrint(data = []) {
  const emissionsByCategory = data.reduce((acc, item) => {
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





export function CalculateScopes(data: []) {
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
}

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

export function getCarbonEmissionByCategory(data: [], searchScope:string ) {
  
  let filteredData=[];
  if(searchScope==="all"){
     
    filteredData=data;
  }else{ 
    filteredData=data.filter((item) => Object.keys(item).includes(searchScope) &&
    item[searchScope] > 0);
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

  // Step 3: Transform the summed data into the desired format
  const result = Object.entries(summedData).map(([category, value]) => ({
    label: category,
    value,
  })); 

  return result;
}

export function getCarbonEmission(data: []) {
  return data.map((item) => {
    return item.emission_tracker;
  });
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
