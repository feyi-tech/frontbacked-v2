import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Zap } from 'lucide-react';
import githubGlobe from '@/assets/world-map.svg';
import Link from 'next/link';
import Head from 'next/head';
import { APP_DESCRIPTION, APP_NAME, APP_TITLE } from '../app-config';
import Navigation from './Navigation';
import Footer from './Footer';

const PageContainer: React.FC<{noNav?: boolean, noFooter?: boolean, noPad?: boolean, children: any}> 
= ({ noNav, noFooter, noPad, children }) => {
  return (
    <div className="min-h-screen bg-background">
      { !noNav? <Navigation /> : null }
      {
        !noPad? (
          <main className="container mx-auto py-8 px-4 pt-24">
            { children }
          </main>
        ) : children
      }
      { !noFooter? <Footer /> : null }
    </div>
  );
};

export default PageContainer;