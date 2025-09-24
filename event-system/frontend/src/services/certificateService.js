import api from '../utils/api.js';

/**
 * Certificate Service
 * Handles all certificate-related API calls
 */
export class CertificateService {
  /**
   * Create a new certificate template
   * @param {Object} certificateData - Certificate template data
   * @param {File} templateFile - PDF template file
   * @returns {Promise<Object>} Created certificate
   */
  static async createCertificate(certificateData, templateFile = null) {
    try {
      const formData = new FormData();

      // Add certificate data
      Object.keys(certificateData).forEach(key => {
        if (certificateData[key] !== null && certificateData[key] !== undefined) {
          formData.append(key, certificateData[key]);
        }
      });

      // Add template file if provided
      if (templateFile) {
        formData.append('template', templateFile);
      }

      const response = await api.post('/certificates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create certificate error:', error);
      throw error;
    }
  }

  /**
   * Get all certificates
   * @returns {Promise<Array>} Array of certificates
   */
  static async getCertificates() {
    try {
      const response = await api.get('/certificates');
      return response.data.data;
    } catch (error) {
      console.error('Get certificates error:', error);
      throw error;
    }
  }

  /**
   * Get certificate by ID
   * @param {string} id - Certificate ID
   * @returns {Promise<Object>} Certificate object
   */
  static async getCertificate(id) {
    try {
      const response = await api.get(`/certificates/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get certificate error:', error);
      throw error;
    }
  }

  /**
   * Update certificate
   * @param {string} id - Certificate ID
   * @param {Object} updates - Update data
   * @param {File} templateFile - New template file (optional)
   * @returns {Promise<Object>} Updated certificate
   */
  static async updateCertificate(id, updates, templateFile = null) {
    try {
      const formData = new FormData();

      // Add update data
      Object.keys(updates).forEach(key => {
        if (updates[key] !== null && updates[key] !== undefined) {
          formData.append(key, updates[key]);
        }
      });

      // Add template file if provided
      if (templateFile) {
        formData.append('template', templateFile);
      }

      const response = await api.put(`/certificates/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Update certificate error:', error);
      throw error;
    }
  }

  /**
   * Delete certificate
   * @param {string} id - Certificate ID
   * @returns {Promise<Object>} Delete result
   */
  static async deleteCertificate(id) {
    try {
      const response = await api.delete(`/certificates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete certificate error:', error);
      throw error;
    }
  }

  /**
   * Generate certificate for a response
   * @param {string} certificateId - Certificate template ID
   * @param {string} responseId - Response ID
   * @param {Object} data - Field mapping data
   * @returns {Promise<Blob>} Generated PDF blob
   */
  static async generateCertificate(certificateId, responseId, data = {}) {
    try {
      const response = await api.post(
        `/certificates/${certificateId}/generate`,
        { responseId, data },
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      console.error('Generate certificate error:', error);
      throw error;
    }
  }

  /**
   * Send certificate via email
   * @param {string} certificateId - Certificate template ID
   * @param {string} responseId - Response ID
   * @param {string} to - Recipient email
   * @param {Object} data - Field mapping data
   * @returns {Promise<Object>} Email send result
   */
  static async sendCertificate(certificateId, responseId, to, data = {}) {
    try {
      const response = await api.post(`/certificates/${certificateId}/send`, {
        responseId,
        to,
        data
      });

      return response.data;
    } catch (error) {
      console.error('Send certificate error:', error);
      throw error;
    }
  }

  /**
   * Batch generate certificates
   * @param {string} certificateId - Certificate template ID
   * @param {Array<string>} responseIds - Array of response IDs
   * @param {Object} data - Field mapping data
   * @returns {Promise<Object>} Batch generation results
   */
  static async batchGenerateCertificates(certificateId, responseIds, data = {}) {
    try {
      const response = await api.post(`/certificates/${certificateId}/batch-generate`, {
        responseIds,
        data
      });

      return response.data;
    } catch (error) {
      console.error('Batch generate certificates error:', error);
      throw error;
    }
  }

  /**
   * Process auto-send certificates
   * @param {string} certificateId - Certificate template ID
   * @returns {Promise<Object>} Auto-send processing results
   */
  static async processAutoSend(certificateId) {
    try {
      const response = await api.post(`/certificates/${certificateId}/auto-send`);
      return response.data;
    } catch (error) {
      console.error('Process auto-send error:', error);
      throw error;
    }
  }

  /**
   * Get certificate statistics
   * @param {string} certificateId - Certificate template ID
   * @returns {Promise<Object>} Certificate statistics
   */
  static async getCertificateStats(certificateId) {
    try {
      const response = await api.get(`/certificates/${certificateId}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Get certificate stats error:', error);
      throw error;
    }
  }

  /**
   * Upload certificate template
   * @param {string} certificateId - Certificate ID
   * @param {File} templateFile - Template file
   * @returns {Promise<Object>} Upload result
   */
  static async uploadTemplate(certificateId, templateFile) {
    try {
      const formData = new FormData();
      formData.append('template', templateFile);

      const response = await api.post(`/certificates/${certificateId}/upload-template`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Upload template error:', error);
      throw error;
    }
  }

  /**
   * Validate PDF template
   * @param {File} file - PDF file to validate
   * @returns {Promise<boolean>} Validation result
   */
  static async validateTemplate(file) {
    try {
      // Client-side validation
      if (!file) {
        return false;
      }

      if (file.type !== 'application/pdf') {
        return false;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return false;
      }

      return true;
    } catch (error) {
      console.error('Template validation error:', error);
      return false;
    }
  }

  /**
   * Download certificate as file
   * @param {Blob} pdfBlob - PDF blob
   * @param {string} filename - Filename for download
   */
  static downloadCertificate(pdfBlob, filename = 'certificate.pdf') {
    try {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download certificate error:', error);
      throw error;
    }
  }

  /**
   * Preview certificate (show in new tab)
   * @param {Blob} pdfBlob - PDF blob
   */
  static previewCertificate(pdfBlob) {
    try {
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Preview certificate error:', error);
      throw error;
    }
  }
}

export default CertificateService;
