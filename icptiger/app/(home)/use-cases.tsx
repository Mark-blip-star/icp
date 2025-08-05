
import { Users, Megaphone, Briefcase, Lightbulb, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const useCases = [
  {
    category: "Entrepreneurs",
    description:
      "Build your pipeline, audience, and team without losing focus.",
    icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
    items: [
      "DM podcast hosts, investors, and newsletter curators at scale",
      "Auto-message people engaging with your launches or threads",
      "Find and recruit top hires from Slack groups, events, and niche lists",
      "Auto-book discovery calls with early users, no cold emails needed",
      "Reignite old prospect, advisor, or investor convos from past projects",
      "Automatically follow up with beta waitlist signups",
      "Build momentum, even when you're busy building",
    ],
  },
  {
    category: "Salespeople",
    description: "Fill your pipeline without burning hours.",
    icon: <Users className="w-8 h-8 text-blue-600" />,
    items: [
      "Auto-connect with leads from Sales Navigator",
      "Re-engage past prospects who ghosted",
      "Instantly follow up after demos, webinars, or events",
      "Message inbound leads without lifting a finger",
      "Nurture cold accounts with warm, content-based DMs",
      "Stay top of mind, even when they’re not ready to buy",
      "Book more calls while others are still writing “Hope you're well”",
    ],
  },
  {
    category: "Content Creators",
    description: "Make your content work overtime.",
    icon: <Megaphone className="w-8 h-8 text-blue-600" />,
    items: [
      "DM everyone who likes or comments on your posts",
      "Turn viral posts into subs, signups, or sales",
      "Auto-pitch yourself to podcasts, newsletters, and collabs",
      "Reconnect with old followers or past collaborations",
      "DM creators to co-create, cross-post, or partner",
      "Automatically reach event attendees and niche communities",
      "Build a real audience, not just views",
    ],
  },
  {
    category: "Recruiters",
    description: "Outreach that doesn’t get ignored.",
    icon: <Briefcase className="w-8 h-8 text-blue-600" />,
    items: [
      "Source directly from search to avoid InMail spam",
      "Auto-message attendees from bootcamps, events, or meetups",
      "Reconnect with warm candidates who never replied",
      "DM talent engaging with your (or your founder’s) posts",
      "Auto-follow up with every promising profile without needing a CRM",
      "Keep your talent pipeline warm so you never start from scratch",
      "Look like a team of ten, even when it's just you",
    ],
  },
];

export default function UseCases() {
  return (
    <section className="py-8 bg-gray-50/50 md:py-12 font-inter">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 font-recoleta font-bold">
            LinkedIn = <span className="text-[#0A66C2]">Growth Engine</span>
          </h2>
          <p className="font-outfit font-light text-xl sm:text-2xl md:text-3xl max-w-2xl mx-auto mt-6 text-black/80">
            Here’s how our users are using Tiger to scale outreach without
            lifting a finger.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-20">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
          >
            {useCases.map((useCase) => (
              <AccordionItem
                key={useCase.category}
                value={useCase.category}
                className="glass-card"
              >
                <AccordionTrigger className="p-0 text-left hover:no-underline">
                  <div className="flex items-center w-full gap-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full">
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold leading-7 text-gray-900 md:text-3xl font-outfit">
                        For {useCase.category}
                      </h3>
                      <p className="mt-1 text-lg font-light text-gray-600 md:text-xl font-outfit">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <ul className="space-y-4 border-t border-gray-200/50 pt-6">
                    {useCase.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check
                          className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-600"
                          aria-hidden="true"
                        />
                        <span className="text-lg text-gray-700 font-light font-outfit">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
} 