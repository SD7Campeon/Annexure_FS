import { z } from 'zod';

export const partnerSchema = z.object({
  namePrefix: z.enum(['MR.', 'MS.'], { required_error: 'Prefix is required' }),
  name: z.string().min(1, 'Name is required'),
  relationPrefix: z.enum(['S/O', 'D/O', 'W/O'], { required_error: 'Relation prefix is required' }),
  fatherOrHusbandName: z.string().min(1, 'Father/Husband Name is required'),
  residentialAddress: z.string().min(1, 'Residential Address is required'),
  role: z.enum(['Partner', 'Proprietor'], { required_error: 'Role is required' }),
  firmName: z.string().min(1, 'Firm Name is required'),
  firmAddress: z.string().min(1, 'Firm Address is required'),
  sapCode: z.string().min(1, 'SAP Code is required'),
  vendorCode: z.string().min(1, 'Vendor Code is required'),
  caste: z.enum(['GEN', 'OBC', 'SC', 'ST'], { required_error: 'Caste is required' }),
}).optional().default({}); // Make partnerSchema optional with default empty object

export const tankTruckSchema = z.object({
  srNo: z.number().int().min(1).max(3, 'Sr No. must be 1, 2, or 3'),
  registrationNo: z.string().min(1, 'Registration No. is required'),
  yearOfManufacture: z.number().int().min(1900).max(new Date().getFullYear(), 'Invalid year'),
  registrationDate: z.string().nonempty('Registration Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  capacity: z.enum(['12 KL', '14 KL', '20 KL'], { required_error: 'Capacity is required' }),
  pesoLicenseNo: z.string().min(1, 'PESO License No. is required'),
  registeredOwner: z.string().min(1, 'Registered Owner is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  bookedNos: z.number().int().min(1).max(3, 'Booked Nos must be 1, 2, or 3'),
  bookedCapacity: z.enum(['12 KL', '14 KL', '20 KL'], { required_error: 'Booked Capacity is required' }),
  makeModel: z.string().min(1, 'Make & Model is required'),
  supplierName: z.string().min(1, 'Supplier Name is required'),
  invoiceReference: z.string().min(1, 'Invoice Reference is required'),
}).optional().default({}); // Make tankTruckSchema optional with default empty object

export const formSchema = z.object({
  namePrefix: z.enum(['MR.', 'MS.'], { required_error: 'Prefix is required' }),
  name: z.string().min(1, 'Name is required'),
  relationPrefix: z.enum(['S/O', 'D/O', 'W/O'], { required_error: 'Relation prefix is required' }),
  fatherOrHusbandName: z.string().min(1, 'Father/Husband Name is required'),
  address: z.string().min(1, 'Address is required'),
  firmName: z.string().min(1, 'Firm Name is required'),
  firmAddress: z.string().min(1, 'Firm Address is required'),
  sapCode: z.string().min(1, 'SAP Code is required'),
  vendorCode: z.string().min(1, 'Vendor Code is required'),
  agreementDate: z.string().nonempty('Agreement Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  noOfTrucks: z.number().int().min(1).max(3, 'Number of Trucks must be 1, 2, or 3'),
  partnerDetails: z.array(partnerSchema).optional().default([]), // Default to empty array
  tankTruckDetails: z.array(tankTruckSchema).optional().default([]), // Default to empty array
});

export default formSchema;