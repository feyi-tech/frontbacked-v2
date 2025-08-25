import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "How quickly can I generate a website?",
      answer: "Most websites are generated within 2-5 minutes. Simply choose your theme, provide your content, and our AI will create a professional website ready for launch."
    },
    {
      question: "Do I need any coding knowledge?",
      answer: "No coding knowledge is required! Our platform is designed for everyone. Just describe what you want, and we'll handle all the technical aspects."
    },
    {
      question: "What payment options are supported?",
      answer: "We support both cryptocurrency payments (Bitcoin, Ethereum, etc.) and traditional local currency payments through major payment processors like Stripe and PayPal."
    },
    {
      question: "How do developers earn money from themes?",
      answer: "Developers earn a percentage every time their theme is used to generate a website. The more popular your theme, the more you earn. It's completely passive income once your theme is published."
    },
    {
      question: "Can I customize my generated website?",
      answer: "Yes! While the initial generation is automatic, you can customize colors, content, images, and layout elements through our intuitive editor after generation."
    },
    {
      question: "What makes a good frontbacked theme?",
      answer: "Good themes are responsive, fast-loading, and follow modern web standards. They should use clean HTML, CSS, and JavaScript without external dependencies. Focus on user experience and mobile-first design."
    },
    {
      question: "Is my website secure and reliable?",
      answer: "Absolutely! All generated websites come with SSL certificates, are hosted on secure servers with 99.9% uptime, and include automatic backups and security monitoring."
    },
    {
      question: "Can I use my own domain name?",
      answer: "Yes, you can connect your own custom domain to any generated website. We provide step-by-step instructions to help you set it up."
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Frequently Asked <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about frontbacked and how it works.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gradient-card border border-border rounded-lg px-6 shadow-elegant"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;