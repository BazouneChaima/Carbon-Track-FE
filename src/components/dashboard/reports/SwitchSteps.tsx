import React from 'react';

import ExportStepOne from './ExportStep1';
import ExportStepTwo from './ExportRapport'; 

interface SwitchStepsProps {
  currentStep: number;
}
export default function SwitchSteps({ currentStep }: SwitchStepsProps) {
  switch (currentStep) {
    case 0:
      return <ExportStepOne />;
    case 1:
      return <ExportStepTwo />;
 
  }
}
