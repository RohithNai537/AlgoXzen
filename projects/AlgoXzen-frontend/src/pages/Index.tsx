import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TechStack from '@/components/TechStack';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import DeveloperRegistration from '@/components/DeveloperRegistration';
import ChatWidget from '@/components/LovableAI/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <TechStack />
      <CallToAction />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
