import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <PublicHeader />
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <span className="text-white text-sm font-bold">V</span>
              </div>
              <span className="font-display font-semibold text-gray-700">VapIV API</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 VapIV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
