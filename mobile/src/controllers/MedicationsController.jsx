import { useState, useEffect } from 'react';
import { MedicationModel } from '../models/MedicationModel.jsx';

/**
 * Medications Controller
 * Manages business logic for Medications screen
 */
export function useMedicationsController(token) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadMedications();
    }
  }, [token]);

  const loadMedications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MedicationModel.getAll(token);
      setMedications(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addMedication = async (medicationData) => {
    try {
      const newMedication = await MedicationModel.create(token, medicationData);
      setMedications([...medications, newMedication]);
      return newMedication;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const updateMedication = async (id, medicationData) => {
    try {
      const updated = await MedicationModel.update(token, id, medicationData);
      setMedications(medications.map(med => med.id === id ? updated : med));
      return updated;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const deleteMedication = async (id) => {
    try {
      await MedicationModel.delete(token, id);
      setMedications(medications.filter(med => med.id !== id));
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const scanMedication = async (barcodeData) => {
    try {
      return await MedicationModel.scan(token, barcodeData);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const refresh = () => {
    loadMedications();
  };

  return {
    medications,
    loading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    scanMedication,
    refresh,
  };
}

