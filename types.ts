import React from 'react';

export enum View {
  HOME,
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

declare global {
    interface Window {
        adbreak?: (options: {
            type: string;
            name: string;
            adBreakDone: (placementInfo: any) => void;
            beforeAd?: () => void;
            afterAd?: () => void;
        }) => void;
    }
}