import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Zap } from 'lucide-react';
import githubGlobe from '@/assets/world-map.svg';
import Link from 'next/link';
import Head from 'next/head';
import { APP_DESCRIPTION, APP_NAME, APP_TITLE } from '../app-config';

const Meta: React.FC<{title?: string, description?: string}> = ({ title, description }) => {
  return (
    <Head>
        <title>{ title || `${APP_NAME} | ${APP_TITLE}`}</title>
        <meta name="description" content={ description || APP_DESCRIPTION } />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;