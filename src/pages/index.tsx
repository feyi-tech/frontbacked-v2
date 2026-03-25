import Head from "next/head";
import Image from "next/image";

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import DeveloperSection from '@/components/DeveloperSection';
import UserSection from '@/components/UserSection';
import ThemesSection from '@/components/ThemesSection';
import VideoSection from '@/components/VideoSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import Meta from "../components/Meta";
import PageContainer from "../components/PageContainer";

export default function Index() {
  return (
    <>
      <Meta />
      <PageContainer noPad>
        <HeroSection />
        <DeveloperSection />
        <UserSection />
        <ThemesSection />
        <VideoSection />
        <FAQSection />
      </PageContainer>
    </>
  );
};
