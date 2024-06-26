import React from 'react';
import { Document, Page, Text } from 'react-pdf';
 
 

const MyDocument = () => (
  <Document>
    <Page size="A4"  >
      <Text>This is a simple PDF document!</Text>
    </Page>
  </Document>
);

export default MyDocument;
