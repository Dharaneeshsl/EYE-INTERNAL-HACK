import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CertificateCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FileUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FieldMappingContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FieldMapping = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 100%;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 100%;
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

const CertificateManagement = () => {
  const [template, setTemplate] = useState(null);
  const [fieldMappings, setFieldMappings] = useState([
    { formField: '', certificateField: '' }
  ]);

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTemplate(file);
    }
  };

  const handleAddFieldMapping = () => {
    setFieldMappings([...fieldMappings, { formField: '', certificateField: '' }]);
  };

  const handleFieldMappingChange = (index, field, value) => {
    const newMappings = [...fieldMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setFieldMappings(newMappings);
  };

  return (
    <Container>
      <CertificateCard>
        <Title>Certificate Template</Title>
        <FileUpload onClick={() => document.getElementById('templateUpload').click()}>
          <input
            type="file"
            id="templateUpload"
            hidden
            accept=".pdf"
            onChange={handleTemplateUpload}
          />
          <p>{template ? template.name : 'Drop your certificate template here or click to upload'}</p>
        </FileUpload>
      </CertificateCard>

      <CertificateCard>
        <Title>Field Mapping</Title>
        <FieldMappingContainer>
          {fieldMappings.map((mapping, index) => (
            <FieldMapping key={index}>
              <Select
                value={mapping.formField}
                onChange={(e) => handleFieldMappingChange(index, 'formField', e.target.value)}
              >
                <option value="">Select Form Field</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="course">Course</option>
              </Select>
              <Input
                type="text"
                placeholder="Certificate Field Name"
                value={mapping.certificateField}
                onChange={(e) => handleFieldMappingChange(index, 'certificateField', e.target.value)}
              />
            </FieldMapping>
          ))}
        </FieldMappingContainer>
        <Button onClick={handleAddFieldMapping} style={{ marginTop: '1rem' }}>
          Add Field Mapping
        </Button>
      </CertificateCard>

      <Button>Save Certificate Configuration</Button>
    </Container>
  );
};

export default CertificateManagement;