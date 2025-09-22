
import React from 'react';
import { SearchInterface } from '@/components/SearchInterface';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-500">
      <div className="container mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2 animate-slide-in">
            <h1 className="text-5xl font-bold text-blue-600">
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
        <br />
        <footer className="text-left">
          <p className='text-gray-400'>
            API: {' '}
            <a
              href="https://github.com/kongvut/thai-province-data?tab=readme-ov-file"
              className="text-primary hover:text-primary/80"
              target='_blank'
            >
              thai-province-data
            </a>
          </p>
          <p className='text-gray-400'>
            Powered by:{' '}
            <a
              href="https://github.com/treepope"
              className="text-primary hover:text-primary/80"
              target='_blank'
            >
              https://github.com/treepope
            </a>
          </p>
          <p className='text-gray-400'>
            Open source:{' '}
            <a
              href="https://github.com/treepope/thai-locations"
              className="text-primary hover:text-primary/80"
              target='_blank'
            >
              https://github.com/treepope/thai-locations
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
