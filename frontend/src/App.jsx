import {
    Home,
    About,
    NotFound,
    Authentication,
    Relations,
    TimeCapsule,
    AssembleTimeCapsule,
    AddMemories,
    ViewCapsule,
    AddEvent,
} from './pages';

import ErrorBoundary from './components/ErrorBoundary.jsx';
import {ThemeProvider} from '@/components/theme-provider';
import Layout from './Layout.jsx';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {index: true, element: <Home />},

            {path: 'auth', element: <Authentication />},
            {path: 'relations', element: <Relations />},
            {path: 'about', element: <About />},

            {path: 'capsule', element: <TimeCapsule />},
            {path: 'capsule/assemble', element: <AssembleTimeCapsule />},
            {path: 'capsule/memories/:capsuleId', element: <AddMemories />},
            {path: 'capsule/view/:capsuleId', element: <ViewCapsule />},

            {path: 'event', element: <AddEvent />},

            {path: '*', element: <NotFound />},
        ],
    },
]);

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ErrorBoundary>
                <RouterProvider router={router} />
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
