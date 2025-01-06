import React from 'react';
import { FooterWrapper, FooterText, FooterLink } from './FooterContainer.styles';

const FooterContainer = () => {
  return (
    <FooterWrapper>
      <FooterText>
        &copy; 2025 HedgeWise Inc. All Rights Reserved | 
        <FooterLink href="/terms">Terms of Service</FooterLink> | 
        <FooterLink href="/privacy">Privacy Policy</FooterLink>
      </FooterText>
    </FooterWrapper>
  );
};

export default FooterContainer;