import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnexureForm } from '../hooks/useAnnexureForm';

const CombinedForm = () => {
  const {
    form,
    setForm,
    errors,
    handleChange,
    handlePartnerChange,
    handleTankTruckChange,
    addPartner,
    addTankTruck,
    removePartner,
    removeTankTruck,
    handleSubmit,
    generatePDFs,
    FormSection,
  } = useAnnexureForm();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', form);
    const result = await handleSubmit(form, navigate);
    if (result) {
      console.log('Form submitted successfully:', result);
      setForm({
        namePrefix: '',
        name: '',
        relationPrefix: '',
        fatherOrHusbandName: '',
        address: '',
        firmName: '',
        firmAddress: '',
        sapCode: '',
        vendorCode: '',
        agreementDate: '',
        noOfTrucks: 0,
        partnerDetails: [],
        tankTruckDetails: [],
      });
      generatePDFs(form); // Generate PDFs after successful submission
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormSection className="main-details">
        <h2>Main Details</h2>
        <div>
          <label>Name Prefix</label>
          <select name="namePrefix" value={form.namePrefix} onChange={handleChange}>
            <option value="">Select</option>
            <option value="MR.">MR.</option>
            <option value="MS.">MS.</option>
          </select>
          {errors.namePrefix && <span>{errors.namePrefix}</span>}
        </div>
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div>
          <label>Relation Prefix</label>
          <select name="relationPrefix" value={form.relationPrefix} onChange={handleChange}>
            <option value="">Select</option>
            <option value="S/O">S/O</option>
            <option value="D/O">D/O</option>
            <option value="W/O">W/O</option>
          </select>
          {errors.relationPrefix && <span>{errors.relationPrefix}</span>}
        </div>
        <div>
          <label>Father/Husband Name</label>
          <input name="fatherOrHusbandName" value={form.fatherOrHusbandName} onChange={handleChange} />
          {errors.fatherOrHusbandName && <span>{errors.fatherOrHusbandName}</span>}
        </div>
        <div>
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} />
          {errors.address && <span>{errors.address}</span>}
        </div>
        <div>
          <label>Firm Name</label>
          <input name="firmName" value={form.firmName} onChange={handleChange} />
          {errors.firmName && <span>{errors.firmName}</span>}
        </div>
        <div>
          <label>Firm Address</label>
          <input name="firmAddress" value={form.firmAddress} onChange={handleChange} />
          {errors.firmAddress && <span>{errors.firmAddress}</span>}
        </div>
        <div>
          <label>SAP Code</label>
          <input name="sapCode" value={form.sapCode} onChange={handleChange} />
          {errors.sapCode && <span>{errors.sapCode}</span>}
        </div>
        <div>
          <label>Vendor Code</label>
          <input name="vendorCode" value={form.vendorCode} onChange={handleChange} />
          {errors.vendorCode && <span>{errors.vendorCode}</span>}
        </div>
        <div>
          <label>Agreement Date</label>
          <input name="agreementDate" type="date" value={form.agreementDate} onChange={handleChange} />
          {errors.agreementDate && <span>{errors.agreementDate}</span>}
        </div>
        <div>
          <label>Number of Trucks</label>
          <input name="noOfTrucks" type="number" value={form.noOfTrucks} onChange={handleChange} />
          {errors.noOfTrucks && <span>{errors.noOfTrucks}</span>}
        </div>
      </FormSection>

      <FormSection className="partner-details">
        <h2>Partner Details</h2>
        {(form.partnerDetails || []).map((partner, index) => (
          <div key={index}>
            <h3>Partner {index + 1}</h3>
            <div>
              <label>Name Prefix</label>
              <select name="namePrefix" value={partner.namePrefix} onChange={(e) => handlePartnerChange(index, e)}>
                <option value="">Select</option>
                <option value="MR.">MR.</option>
                <option value="MS.">MS.</option>
              </select>
              {errors[`partnerDetails.${index}.namePrefix`] && <span>{errors[`partnerDetails.${index}.namePrefix`]}</span>}
            </div>
            <div>
              <label>Name</label>
              <input name="name" value={partner.name} onChange={(e) => handlePartnerChange(index, e)} />
              {errors[`partnerDetails.${index}.name`] && <span>{errors[`partnerDetails.${index}.name`]}</span>}
            </div>
            <div>
              <label>Relation Prefix</label>
              <select name="relationPrefix" value={partner.relationPrefix} onChange={(e) => handlePartnerChange(index, e)}>
                <option value="">Select</option>
                <option value="S/O">S/O</option>
                <option value="D/O">D/O</option>
                <option value="W/O">W/O</option>
              </select>
              {errors[`partnerDetails.${index}.relationPrefix`] && <span>{errors[`partnerDetails.${index}.relationPrefix`]}</span>}
            </div>
            <div>
              <label>Father/Husband Name</label>
              <input name="fatherOrHusbandName" value={partner.fatherOrHusbandName} onChange={(e) => handlePartnerChange(index, e)} />
              {errors[`partnerDetails.${index}.fatherOrHusbandName`] && <span>{errors[`partnerDetails.${index}.fatherOrHusbandName`]}</span>}
            </div>
            <div>
              <label>Residential Address</label>
              <input name="residentialAddress" value={partner.residentialAddress} onChange={(e) => handlePartnerChange(index, e)} />
              {errors[`partnerDetails.${index}.residentialAddress`] && <span>{errors[`partnerDetails.${index}.residentialAddress`]}</span>}
            </div>
            <div>
              <label>Role</label>
              <select name="role" value={partner.role} onChange={(e) => handlePartnerChange(index, e)}>
                <option value="">Select</option>
                <option value="Partner">Partner</option>
                <option value="Proprietor">Proprietor</option>
              </select>
              {errors[`partnerDetails.${index}.role`] && <span>{errors[`partnerDetails.${index}.role`]}</span>}
            </div>
            <div>
              <label>Firm Name</label>
              <input name="firmName" value={partner.firmName} onChange={(e) => handlePartnerChange(index, e)} />
              {errors[`partnerDetails.${index}.firmName`] && <span>{errors[`partnerDetails.${index}.firmName`]}</span>}
            </div>
            <div>
              <label>Firm Address</label>
              <input name="firmAddress" value={partner.firmAddress} onChange={(e) => handlePartnerChange(index, e)} />
              {errors[`partnerDetails.${index}.firmAddress`] && <span>{errors[`partnerDetails.${index}.firmAddress`]}</span>}
            </div>
            <div>
              <label>SAP Code</label>
              <input name="sapCode" value={partner.sapCode} onChange={(e) => handlePartnerChange(index, e)} />
              {errors[`partnerDetails.${index}.sapCode`] && <span>{errors[`partnerDetails.${index}.sapCode`]}</span>}
            </div>
            <div>
              <label>Vendor Code</label>
              <input name="vendorCode" value={partner.vendorCode} onChange={(e) => handlePartnerChange(index, e)} />
              {errors[`partnerDetails.${index}.vendorCode`] && <span>{errors[`partnerDetails.${index}.vendorCode`]}</span>}
            </div>
            <div>
              <label>Caste</label>
              <select name="caste" value={partner.caste} onChange={(e) => handlePartnerChange(index, e)}>
                <option value="">Select</option>
                <option value="GEN">GEN</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
              {errors[`partnerDetails.${index}.caste`] && <span>{errors[`partnerDetails.${index}.caste`]}</span>}
            </div>
            <button type="button" onClick={() => removePartner(index)}>Remove Partner</button>
          </div>
        ))}
        <button type="button" onClick={addPartner}>Add Partner</button>
      </FormSection>

      <FormSection className="tank-truck-details">
        <h2>Tank Truck Details</h2>
        {(form.tankTruckDetails || []).map((truck, index) => (
          <div key={index}>
            <h3>Tank Truck {index + 1}</h3>
            <div>
              <label>Sr No</label>
              <input name="srNo" type="number" value={truck.srNo} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.srNo`] && <span>{errors[`tankTruckDetails.${index}.srNo`]}</span>}
            </div>
            <div>
              <label>Registration No</label>
              <input name="registrationNo" value={truck.registrationNo} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.registrationNo`] && <span>{errors[`tankTruckDetails.${index}.registrationNo`]}</span>}
            </div>
            <div>
              <label>Year of Manufacture</label>
              <input name="yearOfManufacture" type="number" value={truck.yearOfManufacture} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.yearOfManufacture`] && <span>{errors[`tankTruckDetails.${index}.yearOfManufacture`]}</span>}
            </div>
            <div>
              <label>Registration Date</label>
              <input name="registrationDate" type="date" value={truck.registrationDate} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.registrationDate`] && <span>{errors[`tankTruckDetails.${index}.registrationDate`]}</span>}
            </div>
            <div>
              <label>Capacity</label>
              <select name="capacity" value={truck.capacity} onChange={(e) => handleTankTruckChange(index, e)}>
                <option value="">Select</option>
                <option value="12 KL">12 KL</option>
                <option value="14 KL">14 KL</option>
                <option value="20 KL">20 KL</option>
              </select>
              {errors[`tankTruckDetails.${index}.capacity`] && <span>{errors[`tankTruckDetails.${index}.capacity`]}</span>}
            </div>
            <div>
              <label>PESO License No</label>
              <input name="pesoLicenseNo" value={truck.pesoLicenseNo} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.pesoLicenseNo`] && <span>{errors[`tankTruckDetails.${index}.pesoLicenseNo`]}</span>}
            </div>
            <div>
              <label>Registered Owner</label>
              <input name="registeredOwner" value={truck.registeredOwner} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.registeredOwner`] && <span>{errors[`tankTruckDetails.${index}.registeredOwner`]}</span>}
            </div>
            <div>
              <label>Relationship</label>
              <input name="relationship" value={truck.relationship} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.relationship`] && <span>{errors[`tankTruckDetails.${index}.relationship`]}</span>}
            </div>
            <div>
              <label>Booked Nos</label>
              <input name="bookedNos" type="number" value={truck.bookedNos} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.bookedNos`] && <span>{errors[`tankTruckDetails.${index}.bookedNos`]}</span>}
            </div>
            <div>
              <label>Booked Capacity</label>
              <select name="bookedCapacity" value={truck.bookedCapacity} onChange={(e) => handleTankTruckChange(index, e)}>
                <option value="">Select</option>
                <option value="12 KL">12 KL</option>
                <option value="14 KL">14 KL</option>
                <option value="20 KL">20 KL</option>
              </select>
              {errors[`tankTruckDetails.${index}.bookedCapacity`] && <span>{errors[`tankTruckDetails.${index}.bookedCapacity`]}</span>}
            </div>
            <div>
              <label>Make & Model</label>
              <input name="makeModel" value={truck.makeModel} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.makeModel`] && <span>{errors[`tankTruckDetails.${index}.makeModel`]}</span>}
            </div>
            <div>
              <label>Supplier Name</label>
              <input name="supplierName" value={truck.supplierName} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.supplierName`] && <span>{errors[`tankTruckDetails.${index}.supplierName`]}</span>}
            </div>
            <div>
              <label>Invoice Reference</label>
              <input name="invoiceReference" value={truck.invoiceReference} onChange={(e) => handleTankTruckChange(index, e)} />
              {errors[`tankTruckDetails.${index}.invoiceReference`] && <span>{errors[`tankTruckDetails.${index}.invoiceReference`]}</span>}
            </div>
            <button type="button" onClick={() => removeTankTruck(index)}>Remove Tank Truck</button>
          </div>
        ))}
        <button type="button" onClick={addTankTruck}>Add Tank Truck</button>
      </FormSection>

      {errors.general && <span>{errors.general}</span>}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => generatePDFs(form)}>Generate PDFs</button>
    </form>
  );
};

export default CombinedForm;
