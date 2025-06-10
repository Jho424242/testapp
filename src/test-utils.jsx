import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import i18n from './i18n';

const AllTheProviders = ({ children, route = '/' }) => {
  return (
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>{children}</AuthProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, {
    wrapper: (props) => <AllTheProviders {...props} {...options} />,
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
