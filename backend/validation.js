const Joi = require('joi');

const partnerSchema = Joi.object({
  namePrefix: Joi.string().valid('MR.', 'MS.').required().messages({
    'any.only': 'Partner namePrefix must be MR. or MS.',
    'any.required': 'Partner namePrefix is required',
  }),
  name: Joi.string().min(1).required().messages({
    'string.min': 'Partner name is required',
    'any.required': 'Partner name is required',
  }),
  relationPrefix: Joi.string().valid('S/O', 'D/O', 'W/O').required().messages({
    'any.only': 'Partner relationPrefix must be S/O, D/O, or W/O',
    'any.required': 'Partner relationPrefix is required',
  }),
  fatherOrHusbandName: Joi.string().min(1).required().messages({
    'string.min': 'Partner fatherOrHusbandName is required',
    'any.required': 'Partner fatherOrHusbandName is required',
  }),
  residentialAddress: Joi.string().min(1).required().messages({
    'string.min': 'Partner residentialAddress is required',
    'any.required': 'Partner residentialAddress is required',
  }),
  role: Joi.string().valid('Partner', 'Proprietor').required().messages({
    'any.only': 'Partner role must be Partner or Proprietor',
    'any.required': 'Partner role is required',
  }),
  firmName: Joi.string().min(1).required().messages({
    'string.min': 'Partner firmName is required',
    'any.required': 'Partner firmName is required',
  }),
  firmAddress: Joi.string().min(1).required().messages({
    'string.min': 'Partner firmAddress is required',
    'any.required': 'Partner firmAddress is required',
  }),
  sapCode: Joi.string().min(1).required().messages({
    'string.min': 'Partner sapCode is required',
    'any.required': 'Partner sapCode is required',
  }),
  vendorCode: Joi.string().min(1).required().messages({
    'string.min': 'Partner vendorCode is required',
    'any.required': 'Partner vendorCode is required',
  }),
  caste: Joi.string().valid('GEN', 'OBC', 'SC', 'ST').required().messages({
    'any.only': 'Partner caste must be GEN, OBC, SC, or ST',
    'any.required': 'Partner caste is required',
  }),
});

const tankTruckSchema = Joi.object({
  srNo: Joi.number().integer().valid(1, 2, 3).required().messages({
    'any.only': 'Tank truck srNo must be 1, 2, or 3',
    'any.required': 'Tank truck srNo is required',
  }),
  registrationNo: Joi.string().min(1).required().messages({
    'string.min': 'Tank truck registrationNo is required',
    'any.required': 'Tank truck registrationNo is required',
  }),
  yearOfManufacture: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'number.min': 'Tank truck yearOfManufacture must be at least 1900',
      'number.max': 'Tank truck yearOfManufacture cannot be in the future',
      'any.required': 'Tank truck yearOfManufacture is required',
    }),
  registrationDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Tank truck registrationDate must be in YYYY-MM-DD format',
      'any.required': 'Tank truck registrationDate is required',
    }),
  capacity: Joi.string().valid('12 KL', '14 KL', '20 KL').required().messages({
    'any.only': 'Tank truck capacity must be 12 KL, 14 KL, or 20 KL',
    'any.required': 'Tank truck capacity is required',
  }),
  pesoLicenseNo: Joi.string().min(1).required().messages({
    'string.min': 'Tank truck pesoLicenseNo is required',
    'any.required': 'Tank truck pesoLicenseNo is required',
  }),
  registeredOwner: Joi.string().min(1).required().messages({
    'string.min': 'Tank truck registeredOwner is required',
    'any.required': 'Tank truck registeredOwner is required',
  }),
  relationship: Joi.string().min(1).required().messages({
    'string.min': 'Tank truck relationship is required',
    'any.required': 'Tank truck relationship is required',
  }),
  bookedNos: Joi.number().integer().valid(1, 2, 3).required().messages({
    'any.only': 'Tank truck bookedNos must be 1, 2, or 3',
    'any.required': 'Tank truck bookedNos is required',
  }),
  bookedCapacity: Joi.string().valid('12 KL', '14 KL', '20 KL').required().messages({
    'any.only': 'Tank truck bookedCapacity must be 12 KL, 14 KL, or 20 KL',
    'any.required': 'Tank truck bookedCapacity is required',
  }),
  makeModel: Joi.string().min(1).required().messages({
    'string.min': 'Tank truck makeModel is required',
    'any.required': 'Tank truck makeModel is required',
  }),
  supplierName: Joi.string().min(1).required().messages({
    'string.min': 'Tank truck supplierName is required',
    'any.required': 'Tank truck supplierName is required',
  }),
  invoiceReference: Joi.string().min(1).required().messages({
    'string.min': 'Tank truck invoiceReference is required',
    'any.required': 'Tank truck invoiceReference is required',
  }),
});

const submissionSchema = Joi.object({
  namePrefix: Joi.string().valid('MR.', 'MS.').required().messages({
    'any.only': 'Invalid namePrefix, must be MR. or MS.',
    'any.required': 'Name prefix is required',
  }),
  name: Joi.string().min(1).required().messages({
    'string.min': 'Name is required and must be a string',
    'any.required': 'Name is required',
  }),
  relationPrefix: Joi.string().valid('S/O', 'D/O', 'W/O').required().messages({
    'any.only': 'Invalid relationPrefix, must be S/O, D/O, or W/O',
    'any.required': 'Relation prefix is required',
  }),
  fatherOrHusbandName: Joi.string().min(1).required().messages({
    'string.min': 'Father/Husband Name is required and must be a string',
    'any.required': 'Father/Husband Name is required',
  }),
  address: Joi.string().min(1).required().messages({
    'string.min': 'Address is required and must be a string',
    'any.required': 'Address is required',
  }),
  firmName: Joi.string().min(1).required().messages({
    'string.min': 'Firm Name is required and must be a string',
    'any.required': 'Firm Name is required',
  }),
  firmAddress: Joi.string().min(1).required().messages({
    'string.min': 'Firm Address is required and must be a string',
    'any.required': 'Firm Address is required',
  }),
  sapCode: Joi.string().min(1).required().messages({
    'string.min': 'SAP Code is required and must be a string',
    'any.required': 'SAP Code is required',
  }),
  vendorCode: Joi.string().min(1).required().messages({
    'string.min': 'Vendor Code is required and must be a string',
    'any.required': 'Vendor Code is required',
  }),
  agreementDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Agreement Date must be in YYYY-MM-DD format',
      'any.required': 'Agreement Date is required',
    }),
  noOfTrucks: Joi.number().integer().valid(1, 2, 3).required().messages({
    'any.only': 'Number of Trucks must be 1, 2, or 3',
    'any.required': 'Number of Trucks is required',
  }),
  partnerDetails: Joi.array().items(partnerSchema).required().messages({
    'array.base': 'partnerDetails must be an array',
  }),
  tankTruckDetails: Joi.array().items(tankTruckSchema).required().messages({
    'array.base': 'tankTruckDetails must be an array',
  }),
});

const validateSubmission = (req, res, next) => {
  const { error } = submissionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: errorMessages.join('; ') });
  }
  next();
};

module.exports = { validateSubmission };
