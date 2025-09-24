import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { CertificateService } from '../../services/certificateService.js';
import { getAllForms } from '../../services/formService.js'; // Import form service

// Keyframes and Styles...
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-left: 240px;
  @media (max-width: 900px) {
    margin-left: 0;
  }
`;

const CertificateCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorContainer = styled.div`
  background-color: #ff4d4f;
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CertificateList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CertificateItem = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.elevated};
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const CreateCertificateForm = styled.div`
  /* Styles for the creation form */
`;

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [forms, setForms] = useState([]);
  const [newCertificateData, setNewCertificateData] = useState({ name: '', description: '', formId: '' });
  const [templateFile, setTemplateFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [certs, allForms] = await Promise.all([
          CertificateService.getCertificates(),
          getAllForms()
        ]);
        setCertificates(certs);
        setForms(allForms);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCertificate = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);
    try {
      await CertificateService.createCertificate(newCertificateData, templateFile);
      setShowCreateForm(false);
      // Refresh certificates list
      const fetchedCertificates = await CertificateService.getCertificates();
      setCertificates(fetchedCertificates);
    } catch (err) {
      setCreateError('Failed to create certificate.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Container>
      <Title>Certificate Management</Title>

      <Button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create New Certificate'}
      </Button>

      {showCreateForm && (
        <CertificateCard>
          <form onSubmit={handleCreateCertificate}>
            <input 
              type="text" 
              placeholder="Certificate Name" 
              onChange={e => setNewCertificateData({...newCertificateData, name: e.target.value})} 
            />
            <textarea 
              placeholder="Description" 
              onChange={e => setNewCertificateData({...newCertificateData, description: e.target.value})} 
            />
            <select onChange={e => setNewCertificateData({...newCertificateData, formId: e.target.value})}>
              <option value="">Select a Form</option>
              {forms.map(form => (
                <option key={form._id} value={form._id}>{form.title}</option>
              ))}
            </select>
            <input type="file" onChange={e => setTemplateFile(e.target.files[0])} />
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Save Certificate'}
            </Button>
            {createError && <ErrorContainer>{createError}</ErrorContainer>}
          </form>
        </CertificateCard>
      )}
      
      {error && <ErrorContainer>{error}</ErrorContainer>}

      {loading ? (
        <LoadingContainer>Loading certificates...</LoadingContainer>
      ) : (
        <CertificateList>
          {certificates.map((cert) => (
            <CertificateItem key={cert._id}>
              <h3>{cert.name}</h3>
              <p>Form: {cert.formId.title}</p>
            </CertificateItem>
          ))}
        </CertificateList>
      )}
    </Container>
  );
};

export default CertificateManagement;
