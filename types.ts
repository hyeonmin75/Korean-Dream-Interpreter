import React from 'react';

export enum View {
  HOME,
  AD,
  RESULT,
  DETAIL,
}

export interface DreamInterpretation {
  title: string;
  summary: string;
  positive_aspects: string;
  advice: string;
}

export interface DreamExample {
    icon: React.ReactNode;
    title: string;
    description: string;
}