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
import TargetCursor from '@/components/TargetCursor.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import {ThemeProvider} from '@/components/theme-provider';
import Layout from './Layout.jsx';
import {PresenceProvider} from '@/context/PresenceContext';

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
                <PresenceProvider>
                    <TargetCursor
                        spinDuration={2.5}
                        hideDefaultCursor={true}
                        parallaxOn={true}
                    />
                    <RouterProvider router={router} />
                </PresenceProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
