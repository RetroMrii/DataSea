import AppLayout from '../components/layout/AppLayout.jsx';

function Profile() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-white">Profile</h1>
      <p className="mt-2 text-slate-400">
        User profile details will be connected after authentication.
      </p>
    </AppLayout>
  );
}

export default Profile;