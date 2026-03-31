import React from 'react';
import { Bell } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export default function Notifications() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <BackButton />
      <div className="bg-green-50 p-6 rounded-full mb-6">
        <Bell className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h2>
      <p className="text-gray-500 text-lg">you do not have any notification yet</p>
    </div>
  );
}
