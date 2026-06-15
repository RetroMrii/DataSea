import Sidebar from './Sidebar.jsx';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      <Sidebar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;