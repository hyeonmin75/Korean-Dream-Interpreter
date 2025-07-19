import React from 'react';

/**
 * @deprecated This component is no longer in use.
 * The 8-second ad waiting screen has been replaced by a programmatic 
 * interstitial ad called directly from App.tsx via `window.adbreak()`.
 * This provides a better user experience and aligns with modern ad practices.
 * 이 컴포넌트는 더 이상 사용되지 않습니다. 8초 대기 광고 화면은 App.tsx에서 
 * `window.adbreak()`를 통해 직접 호출되는 최신 전면 광고 방식으로 대체되었습니다.
 */
const InterstitialAd: React.FC = () => {
  // This component is intentionally left blank as it's deprecated.
  return null;
};

export default InterstitialAd;
