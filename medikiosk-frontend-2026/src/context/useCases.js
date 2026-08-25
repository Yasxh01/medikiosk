import { useContext } from 'react';
import { CaseContext } from './caseContextInstance';

export function useCases() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}
