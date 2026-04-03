import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    title: "Application Received",
    message: "Your scholarship application has been successfully received and is now under review.",
    time: "2 hours ago",
    type: "success",
    icon: CheckCircle2,
    color: "text-primary-600 bg-primary-50"
  },
  {
    id: 2,
    title: "Document Verification",
    message: "Your WAEC result has been verified by our academic board.",
    time: "1 day ago",
    type: "info",
    icon: Info,
    color: "text-blue-600 bg-blue-50"
  },
  {
    id: 3,
    title: "Incomplete Profile",
    message: "Please complete your profile information to avoid delays in processing.",
    time: "3 days ago",
    type: "warning",
    icon: AlertCircle,
    color: "text-yellow-600 bg-yellow-50"
  }
];

export default function Notifications() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-100 rounded-xl">
          <Bell className="w-6 h-6 text-primary-700" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notif) => (
          <Card key={notif.id} className="border-slate-100 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${notif.color}`}>
                  <notif.icon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{notif.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {notif.time}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockNotifications.length === 0 && (
        <div className="text-center py-24">
          <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Bell className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Notifications</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            You're all caught up! We'll notify you when there's an update on your application.
          </p>
        </div>
      )}
    </div>
  );
}
