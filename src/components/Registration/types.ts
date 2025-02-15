export interface RegistrationData {
  // ... existing fields ...
  
  // Residential Address
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  
  // Current Location (if different from residential)
  isCurrentLocationDifferent: boolean;
  currentStreetAddress?: string;
  currentSuburb?: string;
  currentState?: string;
  currentPostcode?: string;
  
  // ... existing fields ...
}

// ... rest of the file ... 