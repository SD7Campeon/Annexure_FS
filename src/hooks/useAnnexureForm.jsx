import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Correct import
import { formSchema } from '../constants/schemas';
import { makeAuthenticatedRequest } from '../utils/api';

// Shared base entity for common fields
const baseEntity = {
  namePrefix: '',
  name: '',
  firmName: '',
  firmAddress: '',
  sapCode: '',
  vendorCode: '',
};

// Constants for initial state
const initialPartner = {
  ...baseEntity,
  relationPrefix: '',
  fatherOrHusbandName: '',
  residentialAddress: '',
  role: '',
  caste: '',
};

const initialTankTruck = {
  srNo: 1,
  registrationNo: '',
  yearOfManufacture: 2025,
  registrationDate: '',
  capacity: '',
  pesoLicenseNo: '',
  registeredOwner: '',
  relationship: '',
  bookedNos: 1,
  bookedCapacity: '',
  makeModel: '',
  supplierName: '',
  invoiceReference: '',
};

const initialForm = {
  ...baseEntity,
  relationPrefix: '',
  fatherOrHusbandName: '',
  address: '',
  agreementDate: '',
  noOfTrucks: 0,
  partnerDetails: [],
  tankTruckDetails: [],
};

// FormSection component for animation
const FormSection = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`${className} form-section ${isVisible ? 'animate-section' : ''}`}
    >
      {children}
    </div>
  );
};

// PDF generation utilities
const addTitle = (doc, title, y) => {
  doc.setFontSize(16);
  doc.text(title, 20, y);
  return y + 20;
};

const createAnnexureITable = (doc, formData) => {
  doc.setFontSize(12);
  autoTable(doc, {
    startY: 30,
    body: [
      ['Owner', `${formData.namePrefix || ''} ${formData.name || ''}`],
      ['Relation', `${formData.relationPrefix || ''} ${formData.fatherOrHusbandName || ''}`],
      ['Address', formData.address || ''],
      ['Firm Name', `M/s ${formData.firmName || ''}`],
      ['Firm Address', formData.firmAddress || ''],
      ['SAP Code', formData.sapCode || ''],
      ['Vendor Code', formData.vendorCode || ''],
      ['Agreement Date', formData.agreementDate || ''],
      ['No. of Trucks', formData.noOfTrucks || '0'],
    ],
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 113, 227], textColor: [255, 255, 255] },
    columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 120 } },
  });
};

const createAnnexureIITables = (doc, formData) => {
  let startY = 30;
  doc.setFontSize(12);

  const partners = formData.partnerDetails || [];
  partners.forEach((partner, index) => {
    autoTable(doc, {
      startY,
      head: [[`Consortium ${index + 1}`]],
      body: [
        ['Name', `${partner.namePrefix || ''} ${partner.name || ''}`],
        ['Relation', `${partner.relationPrefix || ''} ${partner.fatherOrHusbandName || ''}`],
        ['Address', partner.residentialAddress || ''],
        ['Role', partner.role || ''],
        ['Firm Name', `M/s ${partner.firmName || ''}`],
        ['Firm Address', partner.firmAddress || ''],
        ['SAP Code', partner.sapCode || ''],
        ['Vendor Code', partner.vendorCode || ''],
        ['Caste', partner.caste || ''],
      ],
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 113, 227], textColor: [255, 255, 255] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 120 } },
    });
    startY = doc.lastAutoTable.finalY + 10;
  });

  const trucks = formData.tankTruckDetails || [];
  trucks.forEach((truck, index) => {
    autoTable(doc, {
      startY,
      head: [[`Tank Truck ${index + 1}`]],
      body: [
        ['Sr No', truck.srNo || ''],
        ['Registration No', truck.registrationNo || ''],
        ['Year of Manufacture', truck.yearOfManufacture || ''],
        ['Registration Date', truck.registrationDate || ''],
        ['Capacity', truck.capacity || ''],
        ['PESO License No', truck.pesoLicenseNo || ''],
        ['Registered Owner', truck.registeredOwner || ''],
        ['Relationship', truck.relationship || ''],
        ['Booked Nos', truck.bookedNos || ''],
        ['Booked Capacity', truck.bookedCapacity || ''],
        ['Make & Model', truck.makeModel || ''],
        ['Supplier Name', truck.supplierName || ''],
        ['Invoice Reference', truck.invoiceReference || ''],
      ],
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 113, 227], textColor: [255, 255, 255] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 120 } },
    });
    startY = doc.lastAutoTable.finalY + 10;
  });
};

export const useAnnexureForm = (initialData = {}) => {
  const [form, setForm] = useState({
    ...initialForm,
    ...initialData,
    partnerDetails: initialData.partnerDetails || [],
    tankTruckDetails: initialData.tankTruckDetails || [],
  });
  const [errors, setErrors] = useState({});

  // Generic handler for top-level form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'noOfTrucks' ? parseInt(value) || 0 : value,
    }));
  };

  // Generic handler for array fields
  const handleArrayChange = (arrayName, index, e) => {
    const { name, value } = e.target;
    const numericFields = ['srNo', 'yearOfManufacture', 'bookedNos'];
    const updatedArray = [...(form[arrayName] || [])];
    updatedArray[index] = {
      ...updatedArray[index],
      [name]: numericFields.includes(name) ? parseInt(value) || 0 : value,
    };
    setForm((prev) => ({ ...prev, [arrayName]: updatedArray }));
  };

  // Pre-bound handlers for specific arrays
  const handlePartnerChange = (index, e) => handleArrayChange('partnerDetails', index, e);
  const handleTankTruckChange = (index, e) => handleArrayChange('tankTruckDetails', index, e);

  // Generic add item to array
  const addItem = (arrayName, defaultItem) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), { ...defaultItem }],
    }));
  };

  // Generic remove item from array
  const removeItem = (arrayName, index) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: (prev[arrayName] || []).filter((_, i) => i !== index),
    }));
  };

  const validateForm = (formData) => {
    try {
      console.log('Validating form data:', formData);
      if (!formData || typeof formData !== 'object') {
        console.error('Invalid form data:', formData);
        setErrors({ general: 'Form data is invalid' });
        return { isValid: false };
      }

      const updatedForm = {
        ...formData,
        noOfTrucks: parseInt(formData.noOfTrucks) || 0,
        partnerDetails: (formData.partnerDetails || []).map((partner) => ({
          ...initialPartner,
          ...partner,
        })),
        tankTruckDetails: (formData.tankTruckDetails || []).map((truck) => ({
          ...initialTankTruck,
          ...truck,
          srNo: parseInt(truck.srNo) || 1,
          yearOfManufacture: parseInt(truck.yearOfManufacture) || 2025,
          bookedNos: parseInt(truck.bookedNos) || 1,
        })),
      };
      console.log('Validated form data before schema:', updatedForm);

      const result = formSchema.safeParse(updatedForm);
      if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message || 'Please fill this field correctly.';
        });
        setErrors(fieldErrors);
        console.error('Validation errors:', fieldErrors);
        return { isValid: false, errors: fieldErrors };
      }
      setErrors({});
      return { isValid: true, data: updatedForm };
    } catch (error) {
      console.error('Validation error details:', error);
      setErrors({ general: 'An unexpected error occurred during validation.' });
      return { isValid: false };
    }
  };

  const handleSubmit = async (formData, navigate) => {
    const validationResult = validateForm(formData);
    if (!validationResult.isValid) {
      return false;
    }

    try {
      // Only send fields required by the backend
      const submissionData = {
        namePrefix: formData.namePrefix,
        name: formData.name,
        relationPrefix: formData.relationPrefix,
        fatherOrHusbandName: formData.fatherOrHusbandName,
        address: formData.address,
        firmName: formData.firmName,
        firmAddress: formData.firmAddress,
        sapCode: formData.sapCode,
        vendorCode: formData.vendorCode,
        agreementDate: formData.agreementDate,
        noOfTrucks: parseInt(formData.noOfTrucks) || 0,
      };

      const response = await makeAuthenticatedRequest(
        'http://localhost:5000/api/submissions',
        {
          method: 'POST',
          body: JSON.stringify(submissionData),
        },
        navigate
      );
      console.log('Form submission response:', response);
      return response;
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ general: error.message || 'Failed to submit form' });
      return false;
    }
  };

  const generatePDFs = (formData) => {
    try {
      console.log('Generating PDFs with formData:', formData);
      if (!formData || typeof formData !== 'object') {
        throw new Error('Invalid form data provided');
      }

      const validationResult = validateForm(formData);
      if (!validationResult.isValid) {
        throw new Error('Form data validation failed');
      }

      const safeFormData = {
        ...validationResult.data,
        partnerDetails: validationResult.data.partnerDetails || [],
        tankTruckDetails: validationResult.data.tankTruckDetails || [],
      };

      const doc1 = new jsPDF();
      addTitle(doc1, 'ANNEXURE I - Main RO Details', 20);
      createAnnexureITable(doc1, safeFormData);

      const doc2 = new jsPDF();
      addTitle(doc2, 'ANNEXURE II - Consortium and Tank Truck Details', 20);
      createAnnexureIITables(doc2, safeFormData);

      doc1.save('Annexure_I.pdf');
      doc2.save('Annexure_II.pdf');
    } catch (error) {
      console.error('Error generating PDFs:', error);
      alert('Failed to generate PDFs: ' + error.message);
    }
  };

  return {
    form,
    setForm,
    errors,
    setErrors,
    handleChange,
    handlePartnerChange,
    handleTankTruckChange,
    addPartner: () => addItem('partnerDetails', initialPartner),
    addTankTruck: () => addItem('tankTruckDetails', initialTankTruck),
    removePartner: (index) => removeItem('partnerDetails', index),
    removeTankTruck: (index) => removeItem('tankTruckDetails', index),
    generatePDFs,
    validateForm,
    handleSubmit,
    FormSection,
  };
};

export default useAnnexureForm;
