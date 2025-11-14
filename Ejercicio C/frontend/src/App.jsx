import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto py-10 md:py-20">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
