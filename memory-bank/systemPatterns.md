# System Patterns: WLXR Health Optimization Platform

## 1. Application Architecture

The application follows a component-based architecture using React. The UI is broken down into a series of reusable components, which are organized into the following categories:

*   **Pages:** Top-level components that represent a full page in the application (e.g., `HomePage`, `DashboardPage`).
*   **Layouts:** Components that define the overall structure of a page (e.g., `MainLayout`, `Header`).
*   **Components:** Smaller, reusable UI elements (e.g., `Button`, `Card`).
*   **Dashboard Components:** Components that are specific to the user dashboard.

## 2. Routing

Routing is handled by React Router. The application uses a centralized routing configuration to define the different routes and the components that should be rendered for each route. Protected routes are used to restrict access to certain pages to authenticated users.

## 3. Data Flow

*   **State Management:** The React Context API is used for managing global state, such as the currently authenticated user.
*   **Data Fetching:** Data is fetched from the Supabase backend using the `@supabase/supabase-js` library.
*   **Component State:** Local component state is managed using the `useState` and `useReducer` hooks.

## 4. Authentication

Authentication is handled by Supabase Auth. The application provides a secure login and registration flow, and the user's authentication state is managed globally using the Auth Context.

## 5. Internationalization (i18n)

The application uses the `i18next` and `react-i18next` libraries to provide bilingual support (English and German). Translation files are stored in the `src/locales` directory, and the `t()` function is used throughout the application to render translated strings. A language switcher component allows the user to toggle between the supported languages.
