
import React from 'react';
import { SearchInterface } from '@/components/SearchInterface';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2 animate-slide-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              ระบบค้นหาข้อมูลพื้นที่
            </h1>
            <p className="text-lg text-muted-foreground">
              ค้นหาข้อมูลจังหวัด อำเภอ และตำบลทั่วประเทศไทย
            </p>
          </div>
          <div className="animate-fade-in">
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <div className="animate-fade-in">
          <SearchInterface />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
          <p>ข้อมูลจาก Thai Province Data API | สร้างด้วย React + Vite + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
