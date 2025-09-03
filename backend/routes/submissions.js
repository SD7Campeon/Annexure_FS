const express = require('express');
const router = express.Router();
const { Submission, Partner, TankTruck, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { z } = require('zod');
const { Op } = require('sequelize');

// Zod schemas (moved from frontend for consistency)
const partnerSchema = z.object({
  namePrefix: z.enum(['MR.', 'MS.'], { required_error: 'Partner namePrefix is required' }),
  name: z.string().min(1, 'Partner name is required'),
  relationPrefix: z.enum(['S/O', 'D/O', 'W/O'], { required_error: 'Partner relationPrefix is required' }),
  fatherOrHusbandName: z.string().min(1, 'Partner fatherOrHusbandName is required'),
  residentialAddress: z.string().min(1, 'Partner residentialAddress is required'),
  role: z.enum(['Partner', 'Proprietor'], { required_error: 'Partner role is required' }),
  firmName: z.string().min(1, 'Partner firmName is required'),
  firmAddress: z.string().min(1, 'Partner firmAddress is required'),
  sapCode: z.string().min(1, 'Partner sapCode is required'),
  vendorCode: z.string().min(1, 'Partner vendorCode is required'),
  caste: z.enum(['GEN', 'OBC', 'SC', 'ST'], { required_error: 'Partner caste is required' }),
});

const tankTruckSchema = z.object({
  srNo: z.number().int().min(1).max(3, 'Tank truck srNo must be 1, 2, or 3'),
  registrationNo: z.string().min(1, 'Tank truck registrationNo is required'),
  yearOfManufacture: z.number().int().min(1900).max(new Date().getFullYear(), 'Invalid year'),
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tank truck registrationDate must be in YYYY-MM-DD format'),
  capacity: z.enum(['12 KL', '14 KL', '20 KL'], { required_error: 'Tank truck capacity is required' }),
  pesoLicenseNo: z.string().min(1, 'Tank truck pesoLicenseNo is required'),
  registeredOwner: z.string().min(1, 'Tank truck registeredOwner is required'),
  relationship: z.string().min(1, 'Tank truck relationship is required'),
  bookedNos: z.number().int().min(1).max(3, 'Tank truck bookedNos must be 1, 2, or 3'),
  bookedCapacity: z.enum(['12 KL', '14 KL', '20 KL'], { required_error: 'Tank truck bookedCapacity is required' }),
  makeModel: z.string().min(1, 'Tank truck makeModel is required'),
  supplierName: z.string().min(1, 'Tank truck supplierName is required'),
  invoiceReference: z.string().min(1, 'Tank truck invoiceReference is required'),
});

const submissionSchema = z.object({
  namePrefix: z.enum(['MR.', 'MS.'], { required_error: 'Name prefix is required' }),
  name: z.string().min(1, 'Name is required'),
  relationPrefix: z.enum(['S/O', 'D/O', 'W/O'], { required_error: 'Relation prefix is required' }),
  fatherOrHusbandName: z.string().min(1, 'Father/Husband Name is required'),
  address: z.string().min(1, 'Address is required'),
  firmName: z.string().min(1, 'Firm Name is required'),
  firmAddress: z.string().min(1, 'Firm Address is required'),
  sapCode: z.string().min(1, 'SAP Code is required'),
  vendorCode: z.string().min(1, 'Vendor Code is required'),
  agreementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Agreement Date must be in YYYY-MM-DD format'),
  noOfTrucks: z.number().int().min(1).max(3, 'Number of Trucks must be 1, 2, or 3'),
  partnerDetails: z.array(partnerSchema).min(0),
  tankTruckDetails: z.array(tankTruckSchema).min(0),
});

// Validation middleware
const validateSubmission = (req, res, next) => {
  try {
    const result = submissionSchema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.errors.map(err => err.message).join('; ');
      return res.status(400).json({ error: { message: errorMessages, code: 'VALIDATION_ERROR' } });
    }
    req.validatedData = result.data; // Pass validated data to route
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
};

// Protect all routes with auth
router.use(authMiddleware(['user', 'admin']));

// GET all submissions (admin sees all, users see only their own)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const where = req.user.role === 'user' ? { userId: req.user.id } : {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sapCode: { [Op.like]: `%${search}%` } },
        { vendorCode: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Submission.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        { model: Partner, as: 'partnerDetails' },
        { model: TankTruck, as: 'tankTruckDetails' },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      submissions: rows,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// GET single submission by ID
router.get('/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id, {
      include: [
        { model: Partner, as: 'partnerDetails' },
        { model: TankTruck, as: 'tankTruckDetails' },
      ],
    });
    if (!submission) {
      return res.status(404).json({ error: { message: 'Submission not found', code: 'NOT_FOUND' } });
    }
    if (req.user.role === 'user' && submission.userId !== req.user.id) {
      return res.status(403).json({ error: { message: 'Insufficient permissions', code: 'FORBIDDEN' } });
    }
    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// POST new submission
router.post('/', validateSubmission, async (req, res) => {
  const transaction = await Submission.sequelize.transaction();
  try {
    const { partnerDetails, tankTruckDetails, ...submissionData } = req.validatedData;
    submissionData.userId = req.user.id; // Set ownership

    const newSubmission = await Submission.create(submissionData, { transaction });

    if (partnerDetails && partnerDetails.length > 0) {
      const partnersWithId = partnerDetails.map(partner => ({ ...partner, submissionId: newSubmission.id }));
      await Partner.bulkCreate(partnersWithId, { transaction });
    }

    if (tankTruckDetails && tankTruckDetails.length > 0) {
      const trucksWithId = tankTruckDetails.map(truck => ({ ...truck, submissionId: newSubmission.id }));
      await TankTruck.bulkCreate(trucksWithId, { transaction });
    }

    await transaction.commit();

    // Emit real-time update to admin namespace
    req.io.of('/admin').emit('formUpdated');

    res.status(201).json({ message: 'Submission created successfully', id: newSubmission.id });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating submission:', error);
    res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// PUT update submission by ID
router.put('/:id', authMiddleware(['admin']), validateSubmission, async (req, res) => {
  const transaction = await Submission.sequelize.transaction();
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: { message: 'Submission not found', code: 'NOT_FOUND' } });
    }

    const { partnerDetails, tankTruckDetails, ...submissionData } = req.validatedData;

    await submission.update(submissionData, { transaction });

    // Delete and recreate associations
    await Partner.destroy({ where: { submissionId: submission.id }, transaction });
    if (partnerDetails && partnerDetails.length > 0) {
      const partnersWithId = partnerDetails.map(partner => ({ ...partner, submissionId: submission.id }));
      await Partner.bulkCreate(partnersWithId, { transaction });
    }

    await TankTruck.destroy({ where: { submissionId: submission.id }, transaction });
    if (tankTruckDetails && tankTruckDetails.length > 0) {
      const trucksWithId = tankTruckDetails.map(truck => ({ ...truck, submissionId: submission.id }));
      await TankTruck.bulkCreate(trucksWithId, { transaction });
    }

    await transaction.commit();

    // Emit real-time update
    req.io.of('/admin').emit('formUpdated');

    res.json({ message: 'Submission updated successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating submission:', error);
    res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// DELETE submission by ID
router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: { message: 'Submission not found', code: 'NOT_FOUND' } });
    }

    await submission.destroy(); // Cascades to Partners/TankTrucks

    // Emit real-time update
    req.io.of('/admin').emit('formUpdated');

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

module.exports = router;