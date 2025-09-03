import {
  namePrefixOptions,
  relationPrefixOptions,
  roleOptions,
  casteOptions,
  capacityOptions,
} from './inputOptions.js';

export const mainInputs = [
  { label: 'Name Prefix', name: 'namePrefix', type: 'select', options: namePrefixOptions },
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Relation Prefix', name: 'relationPrefix', type: 'select', options: relationPrefixOptions },
  { label: 'Father/Husband Name', name: 'fatherOrHusbandName', type: 'text' },
  { label: 'Address', name: 'address', type: 'text' },
  { label: 'Firm Name', name: 'firmName', type: 'text' },
  { label: 'Firm Address', name: 'firmAddress', type: 'text' },
  { label: 'SAP Code', name: 'sapCode', type: 'text' },
  { label: 'Vendor Code', name: 'vendorCode', type: 'text' },
  { label: 'Agreement Date', name: 'agreementDate', type: 'date' },
  { label: 'No. of Trucks', name: 'noOfTrucks', type: 'number' },
];

export const partnerInputs = (index) => [
  { label: 'Name Prefix', name: 'namePrefix', type: 'select', options: namePrefixOptions },
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Relation Prefix', name: 'relationPrefix', type: 'select', options: relationPrefixOptions },
  { label: 'Father/Husband Name', name: 'fatherOrHusbandName', type: 'text' },
  { label: 'Residential Address', name: 'residentialAddress', type: 'text' },
  { label: 'Role', name: 'role', type: 'select', options: roleOptions },
  { label: 'Firm Name', name: 'firmName', type: 'text' },
  { label: 'Firm Address', name: 'firmAddress', type: 'text' },
  { label: 'SAP Code', name: 'sapCode', type: 'text' },
  { label: 'Vendor Code', name: 'vendorCode', type: 'text' },
  { label: 'Caste', name: 'caste', type: 'select', options: casteOptions },
];

export const tankTruckInputs = (index) => [
  { label: 'Sr No', name: 'srNo', type: 'number' },
  { label: 'Registration No', name: 'registrationNo', type: 'text' },
  { label: 'Year of Manufacture', name: 'yearOfManufacture', type: 'number' },
  { label: 'Registration Date', name: 'registrationDate', type: 'date' },
  { label: 'Capacity', name: 'capacity', type: 'select', options: capacityOptions },
  { label: 'PESO License No', name: 'pesoLicenseNo', type: 'text' },
  { label: 'Registered Owner', name: 'registeredOwner', type: 'text' },
  { label: 'Relationship', name: 'relationship', type: 'text' },
  { label: 'Booked Nos', name: 'bookedNos', type: 'number' },
  { label: 'Booked Capacity', name: 'bookedCapacity', type: 'select', options: capacityOptions },
  { label: 'Make & Model', name: 'makeModel', type: 'text' },
  { label: 'Supplier Name', name: 'supplierName', type: 'text' },
  { label: 'Invoice Reference', name: 'invoiceReference', type: 'text' },
];
