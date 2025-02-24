import type { RegistrationData } from '../types';

export const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    isThirdParty: 'Registering',
    title: 'Title',
    firstName: 'First Name',
    lastName: 'Last Name',
    medicareNumber: 'Medicare',
    medicareExpiry: 'Expiry',
    medicareIRN: 'IRN',
    birthDay: 'DOB',
    phone: 'Phone',
    email: 'Email',
    mainConcern: 'Main Concern',
    streetAddress: 'Address',
    suburb: 'Suburb',
    state: 'State',
    postcode: 'Postcode',
    nokName: 'Emergency Contact',
    nokRelationship: 'Relationship',
    nokContact: 'Contact Number',
    gpClinicName: 'GP Clinic',
    gpAddress: 'Clinic Address',
    preferredLanguage: 'Language',
    needsInterpreter: 'Needs Interpreter',
    indigenousStatus: 'Indigenous Status',
    religion: 'Religion'
  };
  return labels[field] || field;
};

export const getSectionConfig = (sectionName: string): { fields: string[], layout: string[][] } => {
  const configs: Record<string, { fields: string[], layout: string[][] }> = {
    "Registration Type": {
      fields: ['isThirdParty'],
      layout: [['isThirdParty']]
    },
    "Personal Information": {
      fields: ['title', 'firstName', 'lastName', 'birthDay', 'birthMonth', 'birthYear'],
      layout: [
        ['firstName', 'lastName'],
        ['birthDay']
      ]
    },
    "Medicare Information": {
      fields: ['medicareNumber', 'medicareIRN', 'medicareExpiry'],
      layout: [['medicareNumber'], ['medicareIRN', 'medicareExpiry']]
    },
    "Contact Details": {
      fields: ['phone', 'email', 'preferredLanguage', 'needsInterpreter'],
      layout: [['phone', 'email'], ['preferredLanguage', 'needsInterpreter']]
    },
    "Medical Need": {
      fields: ['mainConcern', 'additionalDetails'],
      layout: [['mainConcern'], ['additionalDetails']]
    },
    "Address Information": {
      fields: ['streetAddress', 'suburb', 'state', 'postcode'],
      layout: [['streetAddress'], ['suburb', 'state'], ['postcode']]
    },
    "Emergency Contact": {
      fields: ['nokName', 'nokRelationship', 'nokContact'],
      layout: [['nokName'], ['nokRelationship', 'nokContact']]
    },
    "GP Information": {
      fields: ['gpClinic', 'gpAddress'],
      layout: [['gpClinic'], ['gpAddress']]
    },
    "Healthcare Context": {
      fields: ['countryOfBirth', 'indigenousStatus', 'religion'],
      layout: [['countryOfBirth'], ['indigenousStatus'], ['religion']]
    }
  };
  return configs[sectionName] || { fields: [], layout: [] };
};

export const formatValue = (
  field: string,
  value: any,
  data: RegistrationData,
  gpInfo: { details: any; isLoading: boolean }
): string => {
  // Special handling for GP details
  if (field === 'gpClinic' || field === 'gpAddress') {
    if (gpInfo.isLoading) {
      return 'Loading...';
    }

    if (gpInfo.details) {
      if (field === 'gpClinic') {
        const clinic = gpInfo.details.HealthOrg_Description;
        return clinic || 'Not provided';
      }

      if (field === 'gpAddress') {
        const addressParts = [
          gpInfo.details.Postal_Address,
          gpInfo.details.Postal_Suburb,
          gpInfo.details.Postal_State,
          gpInfo.details.Postal_Postcode
        ].filter(Boolean);
        return addressParts.join(', ') || 'Not provided';
      }
    }
  }

  if (!value && value !== 0) {
    return 'Not provided';
  }

  // Special handling for medicare number
  if (field === 'medicareNumber' && value) {
    return `${value} (IRN: ${(data as any).medicareIRN || 'Not provided'})`;
  }

  // Special handling for birth date
  if (field === 'birthDay' && (data as any).birthDay && (data as any).birthMonth && (data as any).birthYear) {
    return `${(data as any).birthDay}/${(data as any).birthMonth}/${(data as any).birthYear}`;
  }

  // Special handling for emergency contact
  if (field === 'nokRelationship' && !value && (data as any).nokName) {
    return 'Emergency Contact';
  }

  if (field === 'nokContact' && !value && (data as any).nokName) {
    return 'Contact number not provided';
  }

  return value.toString();
};

export const createSectionSummary = (
  sectionName: string,
  data: RegistrationData,
  gpInfo: { details: any; isLoading: boolean }
): { narrative: string; details?: string[] } => {
  const typedData = data as any;
  
  switch (sectionName) {
    case "Personal Information":
      const personalDetails = [
        typedData.title ? `Title: ${typedData.title}` : null,
        `Name: ${typedData.firstName} ${typedData.lastName}`,
        typedData.birthDay && typedData.birthMonth && typedData.birthYear ? 
          `Date of Birth: ${typedData.birthDay}/${typedData.birthMonth}/${typedData.birthYear}` : null,
        typedData.phone ? `Phone: ${typedData.phone}` : null,
        typedData.email ? `Email: ${typedData.email}` : null,
        typedData.streetAddress ? `Address: ${typedData.streetAddress}` : null,
        typedData.suburb ? `Suburb: ${typedData.suburb}` : null,
        typedData.state && typedData.postcode ? `${typedData.state} ${typedData.postcode}` : null,
        typedData.preferredLanguage ? 
          `Language: ${typedData.preferredLanguage}${typedData.needsInterpreter ? " (interpreter required)" : ""}` : null
      ].filter((val): val is string => Boolean(val));

      return {
        narrative: "Personal Details",
        details: personalDetails
      };

    case "Medicare Information":
      if (!typedData.medicareNumber) return { narrative: "Medicare Details", details: ["No Medicare details provided"] };
      const medicareDetails = [
        `Number: ${typedData.medicareNumber}`,
        typedData.medicareIRN ? `IRN: ${typedData.medicareIRN}` : null,
        typedData.medicareExpiry ? `Expiry: ${typedData.medicareExpiry}` : null
      ].filter((val): val is string => Boolean(val));
      
      return {
        narrative: "Medicare Details",
        details: medicareDetails
      };

    case "Medical Need":
      const medicalDetails = [
        typedData.mainConcern ? `Main Concern: ${typedData.mainConcern}` : "No main concern specified",
        typedData.additionalDetails ? `Additional Details: ${typedData.additionalDetails}` : null
      ].filter((val): val is string => Boolean(val));
      
      return {
        narrative: "Medical Information",
        details: medicalDetails
      };

    case "Healthcare Context":
      const contextDetails = [
        typedData.indigenousStatus ? `Indigenous Status: ${typedData.indigenousStatus}` : null,
        typedData.religion ? `Religion: ${typedData.religion}` : null
      ].filter((val): val is string => Boolean(val));
      
      return {
        narrative: "Healthcare Context",
        details: contextDetails.length ? contextDetails : ["No healthcare context provided"]
      };

    case "Emergency Contact":
      if (!typedData.nokName) return { narrative: "Emergency Contact", details: ["No emergency contact provided"] };
      const emergencyDetails = [
        `Name: ${typedData.nokName}`,
        typedData.nokRelationship ? `Relationship: ${typedData.nokRelationship}` : null,
        typedData.nokContact ? `Contact: ${typedData.nokContact}` : null
      ].filter((val): val is string => Boolean(val));

      return {
        narrative: "Emergency Contact",
        details: emergencyDetails
      };

    case "GP Information":
      if (gpInfo.isLoading) return { narrative: "GP Information", details: ["Loading GP information..."] };
      if (gpInfo.details) {
        const gpDetails = [
          `Clinic: ${gpInfo.details.HealthOrg_Description}`,
          gpInfo.details.Postal_Address ? `Address: ${gpInfo.details.Postal_Address}` : null,
          gpInfo.details.Postal_Suburb ? `Suburb: ${gpInfo.details.Postal_Suburb}` : null,
          gpInfo.details.Postal_State && gpInfo.details.Postal_Postcode ? 
            `${gpInfo.details.Postal_State} ${gpInfo.details.Postal_Postcode}` : null
        ].filter((val): val is string => Boolean(val));

        return {
          narrative: "GP Information",
          details: gpDetails
        };
      }
      return { narrative: "GP Information", details: ["No GP information provided"] };

    default:
      return { narrative: "Information not available" };
  }
}; 