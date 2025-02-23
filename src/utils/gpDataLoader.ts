import Papa from 'papaparse';

export interface GPData {
  HEORG_REFNO: string;
  HealthOrg_Description: string;
  Postal_Address: string;
  Postal_Suburb: string;
  Postal_State: string;
  Postal_Postcode: string;
  Fax: string;
  Phone: string;
  Work_Phone: string;
  Mobile_Phone: string;
  Email: string;
}

let gpData: GPData[] | null = null;

// Mock data for testing - remove this when real data is available
const mockGPData: GPData[] = [
  {
    HEORG_REFNO: "GP001",
    HealthOrg_Description: "City Medical Centre",
    Postal_Address: "123 Main Street",
    Postal_Suburb: "Melbourne",
    Postal_State: "VIC",
    Postal_Postcode: "3000",
    Fax: "",
    Phone: "03 9123 4567",
    Work_Phone: "03 9123 4567",
    Mobile_Phone: "",
    Email: "reception@citymedical.com.au"
  },
  {
    HEORG_REFNO: "GP002",
    HealthOrg_Description: "Suburban Family Practice",
    Postal_Address: "45 High Street",
    Postal_Suburb: "Richmond",
    Postal_State: "VIC",
    Postal_Postcode: "3121",
    Fax: "",
    Phone: "03 9876 5432",
    Work_Phone: "03 9876 5432",
    Mobile_Phone: "",
    Email: "admin@suburbanfp.com.au"
  }
];

export const loadGPData = async (): Promise<void> => {
  if (gpData !== null) return; // Data already loaded
  
  try {
    // First try to load from the public directory
    try {
      const response = await fetch('/data/testhcpdata.csv');
      if (!response.ok) throw new Error('CSV file not found');
      
      const csvText = await response.text();
      if (csvText.includes('<!doctype html>')) {
        throw new Error('Received HTML instead of CSV');
      }
      
      const results = Papa.parse<GPData>(csvText, {
        header: true,
        skipEmptyLines: true,
      });
      
      gpData = results.data;
    } catch (error) {
      console.warn('Failed to load CSV, using mock data:', error);
      // Fallback to mock data
      gpData = mockGPData;
    }
    
    console.log('Loaded GP data:', gpData?.slice(0, 2)); // Debug log first two entries
  } catch (error) {
    console.error('Error loading GP data:', error);
    throw error;
  }
};

export const searchGPs = (query: string): GPData[] => {
  if (!gpData) {
    console.warn('GP data not loaded yet');
    return [];
  }
  if (!query.trim()) return [];

  console.log('Searching GPs with query:', query);
  
  const searchTerms = query.toLowerCase().split(' ');
  const results = gpData
    .filter(gp => {
      // Handle potential undefined values
      const searchString = [
        gp.HealthOrg_Description || '',
        gp.Postal_Address || '',
        gp.Postal_Suburb || '',
        gp.Postal_State || ''
      ].join(' ').toLowerCase();

      const matches = searchTerms.every(term => searchString.includes(term));
      return matches;
    })
    .slice(0, 10); // Limit results to 10 for performance

  console.log('Raw GP search results:', results); // Debug log raw results
  return results;
};

export const getGPById = (id: string): GPData | undefined => {
  if (!gpData) {
    console.warn('GP data not loaded yet');
    return undefined;
  }

  console.log('Looking up GP by ID:', id);
  const gp = gpData.find(gp => gp.HEORG_REFNO === id);
  console.log('Found GP:', gp);
  return gp;
}; 