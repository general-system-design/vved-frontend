import Papa from 'papaparse';

export interface GPData {
  HEORG_REFERENCE: string;
  HealthOrgPostal_Address_Suburb: string;
  Postal_State: string;
  Postal_Postcode: string;
  Fax: string;
  Phone: string;
  Work_Phone: string;
  Mobile_Phone: string;
  Email: string;
}

let gpData: GPData[] | null = null;

export const loadGPData = async (): Promise<void> => {
  if (gpData !== null) return; // Data already loaded
  
  try {
    const response = await fetch('/data/testhcpdata.csv');
    const csvText = await response.text();
    
    const results = Papa.parse<GPData>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    gpData = results.data;
  } catch (error) {
    console.error('Error loading GP data:', error);
    throw error;
  }
};

export const searchGPs = (query: string): GPData[] => {
  if (!gpData) return [];
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(' ');
  
  return gpData
    .filter(gp => {
      const searchString = `${gp.HEORG_REFERENCE} ${gp.HealthOrgPostal_Address_Suburb} ${gp.Postal_State}`.toLowerCase();
      return searchTerms.every(term => searchString.includes(term));
    })
    .slice(0, 10); // Limit results to 10 for performance
}; 