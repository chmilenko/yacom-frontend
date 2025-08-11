let pageComponent = {};

export const setPageComponent = (newProps) => {
  pageComponent = { ...pageComponent, ...newProps };
  window.pageComponent = pageComponent;
};

export const getPageComponent = () => pageComponent;