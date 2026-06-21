import api from './api';
import { triggerBrowserDownload } from '../utils/downloadFile';

export const downloadCombinedReport = async () => {
  const response = await api.get('/api/export/csv', {
    responseType: 'blob',
  });
  
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const filename = `salary_growth_export_${year}-${month}-${day}.csv`;
  
  triggerBrowserDownload(response.data, filename);
};
