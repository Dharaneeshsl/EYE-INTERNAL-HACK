import React, { Suspense } from 'react';

const LoadingFallback = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
);

export const lazyLoad = (importFunc) => {
  const LazyComponent = React.lazy(importFunc);
  return (props) => (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};