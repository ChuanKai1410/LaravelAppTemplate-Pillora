import { useState } from 'react';
import { MedicationModel } from '../models/MedicationModel.jsx';

/**
 * Scan Controller
 * Manages business logic for Scan screen
 */
export function useScanController(token) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (barcodeData) => {
    if (scanned) return null;

    setScanned(true);
    setScanning(true);
    setError(null);

    try {
      const medication = await MedicationModel.scan(token, barcodeData);
      return medication;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setScanning(false);
    }
  };

  const resetScan = () => {
    setScanned(false);
    setError(null);
  };

  return {
    scanning,
    scanned,
    error,
    handleScan,
    resetScan,
  };
}

