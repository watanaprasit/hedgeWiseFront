import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TermsWrapper, TermsTitle, TermsContent, TermsSection, TermsLink } from './TermsOfService.styles';

const TermsOfService = () => {

  const navigate = useNavigate();  // Initialize navigate hook

  const handleBackClick = () => {
    navigate('/login');  // Navigate to login page
  };
  
  return (
    <TermsWrapper>
      <TermsTitle>Terms of Service</TermsTitle>

      <TermsContent>
        <TermsSection>
          <p>
            Welcome to HedgeWise Inc. These Terms of Service ("Terms") govern your use of our website, products, and services provided by HedgeWise Inc. By accessing or using our services, you agree to comply with these Terms. If you do not agree with these Terms, you must not use our services.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using or accessing the HedgeWise Inc. website and services, you acknowledge and agree to these Terms. If you are using the services on behalf of an organization, you represent and warrant that you are authorized to bind that organization to these Terms.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>2. User Responsibilities</h2>
          <p>
            As a user of HedgeWise Inc.'s services, you agree to:
          </p>
          <ul>
            <li>Provide accurate, up-to-date, and complete information when creating an account.</li>
            <li>Be solely responsible for maintaining the confidentiality of your account credentials.</li>
            <li>Notify HedgeWise Inc. immediately if you suspect any unauthorized access or use of your account.</li>
            <li>Comply with all applicable laws and regulations while using our services.</li>
          </ul>
        </TermsSection>

        <TermsSection>
          <h2>3. Account Registration</h2>
          <p>
            In order to access certain features of our services, you may need to register for an account. When registering, you agree to provide accurate and complete information. You are responsible for keeping your account credentials secure and for all activity under your account.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>4. Intellectual Property</h2>
          <p>
            All content, features, and functionality provided by HedgeWise Inc. through the website, including but not limited to text, graphics, logos, images, and software, are the exclusive property of HedgeWise Inc. or its licensors. You may not use, copy, reproduce, or distribute any content without prior written permission from us.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>5. Limitation of Liability</h2>
          <p>
            HedgeWise Inc. shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, arising from your use or inability to use our services, even if we have been advised of the possibility of such damages.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>6. Modifications to the Terms</h2>
          <p>
            HedgeWise Inc. reserves the right to modify these Terms at any time. Any changes will be posted on our website with an updated "Effective Date." Your continued use of our services after such modifications constitutes acceptance of the revised Terms.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>7. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which HedgeWise Inc. is located, without regard to its conflict of law principles.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>8. Dispute Resolution</h2>
          <p>
            In the event of a dispute, you agree to first attempt to resolve the dispute informally by contacting us. If informal resolution fails, you agree to resolve the dispute through binding arbitration in the jurisdiction of HedgeWise Inc.'s headquarters.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>9. Termination</h2>
          <p>
            HedgeWise Inc. reserves the right to terminate or suspend your account at its sole discretion if we believe you have violated these Terms or if we cease offering our services.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>10. Privacy Policy</h2>
          <p>
            Please refer to our <TermsLink href="/privacy">Privacy Policy</TermsLink> to understand how we collect, use, and protect your personal information.
          </p>
        </TermsSection>

        <TermsSection>
          <h2>11. Contact Information</h2>
          <p>
            If you have any questions or concerns regarding these Terms, please contact us at support@hedgewise.com.
          </p>
        </TermsSection>
        <button onClick={handleBackClick} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Back to Login
        </button>
      </TermsContent>
    </TermsWrapper>
  );
};

export default TermsOfService;
