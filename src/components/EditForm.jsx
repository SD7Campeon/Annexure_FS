// C:\Users\hp\Downloads\annexure\frontend\src\components/EditForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnnexureForm } from '../hooks/useAnnexureForm';
import InputField from './InputField';
import { mainInputs, partnerInputs, tankTruckInputs } from '../constants/inputMappers';
import { makeAuthenticatedRequest } from '../utils/api';
import '../styles/App.css';

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    form,
    setForm,
    errors,
    setErrors,
    handleChange,
    handlePartnerChange,
    handleTankTruckChange,
    addPartner,
    addTankTruck,
    removePartner,
    removeTankTruck,
    generatePDFs,
    validateForm,
    FormSection,
  } = useAnnexureForm();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch form data for editing
  const fetchFormData = async () => {
    try {
      setFetchLoading(true);
      const data = await makeAuthenticatedRequest(`http://localhost:5000/api/submissions/${id}`, {
        method: 'GET',
      }, navigate);
      // Ensure partnerDetails and tankTruckDetails are initialized as arrays
      const safeData = {
        ...data,
        partnerDetails: data.partnerDetails || [],
        tankTruckDetails: data.tankTruckDetails || [],
      };
      setForm(safeData);
      setErrors({});
    } catch (error) {
      setErrors({ general: error.message || 'Failed to fetch form data.' });
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, data } = validateForm(form);
    if (!isValid) {
      setErrors((prev) => ({ ...prev, ...errors })); // Merge existing and new errors
      return;
    }

    setSubmitLoading(true);
    try {
      await makeAuthenticatedRequest(`http://localhost:5000/api/submissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }, navigate);
      generatePDFs(form); // Use form state for PDFs
      alert('Form updated successfully!');
      navigate('/admin');
    } catch (error) {
      setErrors({ general: error.message || 'Failed to update form.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="form-container">
      <h2>Edit Annexure Form</h2>
      {submitLoading && (
        <div className="loading" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Updating form...
        </div>
      )}
      {errors.general && (
        <div className="error" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {errors.general}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormSection className="declarant-details">
          <h2>Main RO Details for Proprietorship</h2>
          {mainInputs.map((input, idx) => (
            <InputField
              key={idx}
              {...input}
              value={form[input.name] || ''}
              onChange={handleChange}
              error={errors[input.name]}
            />
          ))}
        </FormSection>

        {form.partnerDetails.map((partner, index) => (
          <FormSection key={`partner-${index}`} className="partner-section">
            <fieldset>
              <legend>Consortium Details {index + 1}</legend>
              {partnerInputs(index).map((input, idx) => (
                <InputField
                  key={idx}
                  {...input}
                  value={partner[input.name] || ''}
                  onChange={(e) => handlePartnerChange(index, e)}
                  error={errors[`partnerDetails.${index}.${input.name}`]}
                />
              ))}
              <button type="button" className="remove-button" onClick={() => removePartner(index)}>
                Remove Consortium
              </button>
            </fieldset>
          </FormSection>
        ))}

        {form.tankTruckDetails.map((truck, index) => (
          <FormSection key={`tank-truck-${index}`} className="partner-section">
            <fieldset>
              <legend>Tank Truck Details {index + 1}</legend>
              {tankTruckInputs(index).map((input, idx) => (
                <InputField
                  key={idx}
                  {...input}
                  value={truck[input.name] || ''}
                  onChange={(e) => handleTankTruckChange(index, e)}
                  error={errors[`tankTruckDetails.${index}.${input.name}`]}
                />
              ))}
              <button type="button" className="remove-button" onClick={() => removeTankTruck(index)}>
                Remove Tank Truck
              </button>
            </fieldset>
          </FormSection>
        ))}

        <FormSection className="form-actions">
          <button type="button" className="apple-button secondary" onClick={addPartner}>
            Add Consortium
          </button>
          <button type="button" className="apple-button secondary" onClick={addTankTruck}>
            Add Tank Truck
          </button>
          <button
            type="submit"
            className="apple-button primary"
            disabled={submitLoading}
          >
            {submitLoading ? 'Updating...' : 'Update and Generate PDFs'}
          </button>
        </FormSection>
      </form>
    </div>
  );
};

export default EditForm;