import ReactGA from 'react-ga4';

let initialized = false;

export const initGA = () => {
  if (initialized) return;
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('VITE_GA_MEASUREMENT_ID not set');
    return;
  }
  ReactGA.initialize(measurementId, {
    testMode: import.meta.env.DEV
  });
  initialized = true;
};

export const trackPageView = (path) => {
  if (localStorage.getItem('analytics-consent') !== 'true') return;
  ReactGA.send({
    hitType: 'pageview',
    page: path
  });
};

export const trackEvent = (category, action, label) => {
  if (localStorage.getItem('analytics-consent') !== 'true') return;
  ReactGA.event({ category, action, label });
};
