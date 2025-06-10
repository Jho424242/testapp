# Tech Context: WLXR Health Optimization Platform

## 1. Frontend

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **State Management:** React Context API
*   **Internationalization:** i18next, react-i18next

## 2. Backend

*   **Service:** Supabase
    *   **Authentication:** Supabase Auth
    *   **Database:** Supabase Postgres
    *   **APIs:** Supabase auto-generated APIs

## 3. Development Environment

*   **Package Manager:** npm
*   **Node.js Version:** As specified in the development environment.
*   **Testing:** Vitest and React Testing Library for unit and integration tests.

## 4. Technical Constraints

*   The application must be responsive and work well on a variety of screen sizes.
*   The application should be performant, with fast load times and a smooth user experience.
*   All user data must be handled securely and in accordance with privacy best practices.
*   **Future Mobile Development:** The architecture should be designed with a future transition to a native mobile app in mind. This includes a focus on decoupled components and business logic to maximize code reuse with a framework like React Native.

## 5. Tool Usage Patterns

*   **Development Server:** The `npm run dev` command starts a persistent development server. **Do not re-run this command if it is already active.** Check the "Actively Running Terminals" section in the environment details for confirmation. A successful launch is indicated by the output 'ready in'. I will not wait for the command to finish if the terminal output already indicates completion.
*   **Test Runner:** The `npm test` command starts the test runner in watch mode. I will follow a strict Red-Green-Refactor workflow for all changes.
    *   **Red:** When a test fails, I will immediately stop all other actions and focus solely on fixing the failing test. I will not proceed until the test passes.
    *   **Green:** Once the test passes, I will run the entire test suite to ensure that my changes have not introduced any regressions.
    *   **Refactor:** Only after the entire test suite is passing will I proceed with any other tasks.
*   **No Unnecessary Waiting:** I will not wait for a command to finish if the terminal output already indicates completion.
*   **Context Window Management:** When the context window exceeds 50% of the available context window, I MUST initiate a task handoff using the `new_task` tool.
