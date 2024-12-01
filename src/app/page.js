import React from 'react';
import LandingPage from '@/app/LandingPage/page';

export default function Home() {
  return (
    <main className="h-full w-full flex justify-center items-center">
      <div className="min-h-[100vh] w-full  h-full  flex  justify-center items-center ">
        <LandingPage />
      </div>
    </main>
  );
}
