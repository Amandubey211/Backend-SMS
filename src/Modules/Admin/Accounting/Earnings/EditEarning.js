import React, { useState, useEffect } from 'react';
import FormInput from '../subClass/component/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { resetFormData, setFormData, setIsEditSidebarOpen } from '../../../../Store/Slices/Admin/Accounting/Earning/earningSlice';
import { fetchEarning, fetchTotalAmounts, updateEarning } from '../../../../Store/Slices/Admin/Accounting/Earning/earning.action';

const EditEarning = () => {
    const { editEarning, formData } = useSelector((store) => store?.admin?.earning)
    const dispatch = useDispatch();

    useEffect(() => {
        if (editEarning) {
            dispatch(setFormData({
                paymentDate: editEarning.dateOfEarning.split('T')[0],
                amount: editEarning.amount,
                description: editEarning.description,
                paymentStatus: editEarning.paymentStatus,
                paymentFrom: editEarning.from,
            }));
        }
    }, [editEarning, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedEarning = {
            from: formData.paymentFrom,
            amount: formData.amount,
            dateOfEarning: formData.paymentDate,
            description: formData.description,
        };

        dispatch(updateEarning({ id: editEarning._id, updatedEarning }))
            .then(() => {
                dispatch(fetchTotalAmounts());
                dispatch(fetchEarning());
                dispatch(setIsEditSidebarOpen(false));
                dispatch(resetFormData()); 
            })
            .catch((err) => {
                console.error("Error updating earning", err);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
    };

    return (
        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
            <FormInput id="paymentFrom" label="From" type="text" name="paymentFrom" value={formData.paymentFrom} onChange={handleChange} required />
            <FormInput id="amount" label="Amount" type="text" name="amount" value={formData.amount} onChange={handleChange} required />
            <FormInput id="paymentDate" label="Earning Date" type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required />
            <FormInput id="description" label="Description" type="text" name="description" value={formData.description} onChange={handleChange} required />
            <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
                Update Earning
            </button>
        </form>
    )
};

export default EditEarning;
