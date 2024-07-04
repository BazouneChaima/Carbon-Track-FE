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
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD') &&
          Object.keys(item).includes(searchScope) && item[searchScope] > 0
      );

     
      break;

    case '30days':
      threshold = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      formattedThreshold = threshold.toISOString().split('T')[0];
      filteredData = data.filter(
        (item) =>
          dayjs(item.Date).format('YYYY-MM-DD') > formattedThreshold &&
          dayjs(item.Date).format('YYYY-MM-DD') <= dayjs(today).format('YYYY-MM-DD')  &&
          Object.keys(item).includes(searchScope) && item[searchScope] > 0
      );
      break;

    case 'quarter':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      filteredData = data.filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= quarterStart && itemDate <= quarterEnd &&  
        Object.keys(item).includes(searchScope) && item[searchScope] > 0;
      });
      break;

    case '12months':
      filteredData = data.filter((item) => (new Date(item.Date).getFullYear() === today.getFullYear()
      &&
      Object.keys(item).includes(searchScope) && item[searchScope] > 0)
    );
      break;

    
  }
  if (startDate && endDate) {
 
    filteredData = data.filter((item) => {
      const itemDate = dayjs(item.Date).format('YYYY-MM-DD');
      return itemDate >= dayjs(startDate).format('YYYY-MM-DD') && 
                  itemDate <= dayjs(endDate).format('YYYY-MM-DD')  &&
                  Object.keys(item).includes(searchScope) && item[searchScope] > 0;
    });
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