import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'VashtyNime Admin Panel - Premium Control Dashboard',
  description: 'Manage, convert, and publish anime titles, episodes, and stream settings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
