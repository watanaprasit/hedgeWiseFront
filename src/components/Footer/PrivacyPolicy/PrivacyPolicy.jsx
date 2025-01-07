import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { PrivacyPolicyWrapper, Title, Section, Paragraph, List } from './PrivacyPolicy.styles';

const PrivacyPolicy = () => {

  const navigate = useNavigate();  // Initialize navigate hook

  const handleBackClick = () => {
    navigate('/login');  // Navigate to login page
  };


  return (
    <PrivacyPolicyWrapper>

      <Title>Privacy Policy</Title>
      <Section>
        <Title>Introduction</Title>
        <Paragraph>
          At HedgeWise Inc., we respect your privacy and are committed to protecting your personal data. This Privacy
          Policy outlines how we collect, use, and protect your information.
        </Paragraph>
      </Section>

      <Section>
        <Title>Information We Collect</Title>
        <Paragraph>
          We may collect the following types of information:
        </Paragraph>
        <List>
          <li>Personal Identification Information (Name, Email, etc.)</li>
          <li>Usage Data (How you interact with our services)</li>
        </List>
      </Section>

      <Section>
        <Title>How We Use Your Information</Title>
        <Paragraph>
          We use your information for various purposes, including:
        </Paragraph>
        <List>
          <li>To provide and maintain our services</li>
          <li>To communicate with you and respond to your inquiries</li>
        </List>
      </Section>

      <Section>
        <Title>Data Security</Title>
        <Paragraph>
          We implement reasonable security measures to protect your personal data. However, no method of transmission over
          the Internet or electronic storage is 100% secure.
        </Paragraph>
      </Section>

      <Section>
        <Title>Your Rights</Title>
        <Paragraph>
          You have the right to access, correct, or delete your personal information. You can also withdraw your consent
          at any time by contacting us.
        </Paragraph>
      </Section>

      <Section>
        <Title>Changes to This Policy</Title>
        <Paragraph>
          We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated
          revision date.
        </Paragraph>
      </Section>

      <Section>
        <Title>Contact Us</Title>
        <Paragraph>
          If you have any questions about this Privacy Policy, please contact us at hedgewiseinc@gmail.com .
        </Paragraph>
      </Section>

        <button onClick={handleBackClick} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Back to Login
        </button>
    </PrivacyPolicyWrapper>
  );
};

export default PrivacyPolicy;
