import AppLayout from '../components/layout/AppLayout.jsx';

function ReportsList() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-white">Reports</h1>
      <p className="mt-2 text-slate-400">
        Phase 12 will load saved report history from the backend.
      </p>
    </AppLayout>
  );
}

export default ReportsList;