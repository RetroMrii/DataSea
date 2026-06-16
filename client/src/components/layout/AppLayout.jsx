import Sidebar from './Sidebar.jsx';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] overflow-x-hidden">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto min-w-0 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;