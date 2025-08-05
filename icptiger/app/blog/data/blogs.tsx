import React from 'react';
import PDFViewer from '../../components/pdf-viewer';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  seoDescription?: string;
  content?: React.ReactNode;
}

export const blogs = [
  {
    id: 9,
    slug: 'how-to-send-500-linkedin-messages-without-getting-banned',
    title: 'How to Send 500+ LinkedIn Messages Without Getting Banned',
    summary: "Learn how successful founders safely bypass LinkedIn's connection and messaging limits to run 100+ high-signal conversations per week. Discover the proven system for scaling your outreach without risking your account.",
    date: '2025-08-01',
    author: 'Tarun Sivakumar',
    seoDescription: 'A comprehensive guide to safely bypassing LinkedIn limits and scaling your outreach while staying compliant. Learn the strategies top startups use to run 100+ conversations per week.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 mb-4">You need to move fast. Your runway is burning, your competition is moving, and every week that passes without meaningful conversations with customers, hires, or investors is a week closer to failure.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">But LinkedIn is designed to slow you down. Connection caps that artificially limit your network growth. Message restrictions that throttle your outreach. Shadowbans that make your carefully crafted messages disappear into the void.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">The platform wants you to "build relationships organically" and "provide value first"—advice that sounds great but doesn't help when you need to validate your product with 50 potential customers next month, or when you're trying to hire your first engineer before your competitor beats you to market.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Here's the reality: while you're playing by LinkedIn's conservative rules, your fastest-moving competitors have figured out how to safely bypass the limits and run 100+ high-signal conversations per week. They're not breaking the platform or risking their accounts—they're just using strategies that LinkedIn doesn't advertise but doesn't prohibit.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">This is exactly how they do it.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The 3 Hard Rules That Keep You Safe</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Before diving into bypass strategies, understand the three non-negotiable rules that separate safe scaling from account suicide:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Rule 1: Keep invites under 100 per day.</strong> LinkedIn's algorithms watch for unnatural spikes in activity. Stay under this threshold and you're operating within their expected human behavior patterns.</li>
            <li className="mb-2"><strong>Rule 2: Don't include messages with your connection requests.</strong> This seems counterintuitive, but connection requests with messages get flagged more often and count against different limits than blank invites.</li>
            <li className="mb-2"><strong>Rule 3: No links, CTAs, or long walls of text in first messages.</strong> These are automatic spam signals. Keep initial DMs conversational and avoid anything that screams "sales outreach."</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">Break these rules and you'll get throttled fast. Follow them religiously, and LinkedIn generally leaves you alone to operate within their system.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Bypass #1: Message Through LinkedIn Groups</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">This is the most underutilized strategy in LinkedIn outreach. When you join a LinkedIn Group, you can message any member directly—no connection request needed, no daily limits applied.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>The process:</strong></p>
          <ol className="list-decimal pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Search for groups</strong> where your ideal customers, hires, or investors are active</li>
            <li className="mb-2"><strong>Join 3-5 relevant groups</strong> (don't go overboard—quality over quantity)</li>
            <li className="mb-2"><strong>Message members directly</strong> as if you're continuing group conversations</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 mb-4">Most people still don't know about this feature, which means your messages stand out in inboxes that aren't flooded with group-based outreach. The key is joining groups that are genuinely relevant to your business so your messages feel natural and contextual.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Bypass #2: Leverage LinkedIn Events</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">LinkedIn Events create a temporary "mutual connection" status between attendees, which unlocks direct messaging privileges without connection limits.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Two approaches work:</strong></p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Attend existing events:</strong> RSVP to events your ideal prospects are attending. Once registered, LinkedIn treats you like mutual connections, enabling direct messaging.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Host your own events:</strong> Create events around topics your ideal audience cares about. Even a simple "Founder Coffee Chat" or "SaaS Growth Discussion" can attract the right people and give you unlimited messaging access to attendees.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">This is one of the safest and least-used growth levers on the platform. Events signal legitimate networking intent, so your messages are less likely to be flagged as spam.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Bypass #3: Target Open Profiles</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Some LinkedIn users have "Open Profiles" that allow anyone to message them directly without connecting first. These profiles are goldmines for outreach because they completely bypass connection limits.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>How to identify and use them:</strong></p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2">Use tools like Evaboot to filter Sales Navigator searches for Open Profiles</li>
            <li className="mb-2">Split your outreach strategy: message Open Profiles directly, send connection requests to others</li>
            <li className="mb-2">This approach can save 50-100 connection requests per week while maintaining the same outreach volume</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">Open Profile users have explicitly opted into receiving messages from strangers, so your response rates are often higher than traditional cold outreach.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Scaling Beyond One Account: The Burner Strategy</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">When you need to scale beyond what one LinkedIn account can handle, additional accounts (often called "burners") can multiply your capacity—but only if done correctly.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Safe burner setup:</strong></p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Warm up slowly</strong> over 10-14 days, starting with fewer than 50 invites per day</li>
            <li className="mb-2"><strong>Use legitimate profiles</strong> with real photos, credible job titles, and professional banners</li>
            <li className="mb-2"><strong>Rotate devices or IP addresses</strong> if you're managing multiple accounts</li>
            <li className="mb-2"><strong>Build genuine network</strong> by connecting with colleagues and industry peers first</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">When executed properly, burner accounts can run quietly for months without detection. The key is patience during setup and maintaining human-like behavior patterns.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Recovering from LinkedIn Jail</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">If you push too hard and hit LinkedIn's limits, don't panic. Most restrictions are temporary if you handle them correctly.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Immediate steps when you see limit warnings:</strong></p>
          <ol className="list-decimal pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Stop all outreach immediately</strong> for 3 days minimum</li>
            <li className="mb-2"><strong>Cancel pending connection requests</strong> to clean up your activity</li>
            <li className="mb-2"><strong>Test manually</strong> before restarting any automation</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 mb-4">A soft reset usually works. The accounts that get permanently restricted are the ones that ignore warnings and keep pushing against the limits.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Unlock Higher Limits Through Trust</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">LinkedIn lets trusted accounts do more. By raising your Social Selling Index (SSI), you can often increase your daily limits significantly.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Boost your SSI by:</strong></p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2">Posting valuable content 1-2 times per week</li>
            <li className="mb-2">Maintaining a high connection acceptance rate</li>
            <li className="mb-2">Connecting consistently with relevant people in your industry</li>
            <li className="mb-2">Engaging meaningfully with others' content</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">At an SSI above 70, many accounts can safely send up to 200 invites per week. Check your current SSI at linkedin.com/sales/ssi and use it as a benchmark for how aggressively you can operate.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The Complete Safe Scaling System</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Here's the high-output system that works consistently:</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Daily activities:</strong></p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2">Send up to 75 blank connection requests to ideal prospects</li>
            <li className="mb-2">Keep follow-ups light (maximum 1-2 per connection)</li>
            <li className="mb-2">Use Groups and Events to message in parallel without using connection limits</li>
            <li className="mb-2">Only include links after receiving a reply or in the 2nd-3rd message</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Weekly results:</strong><br/>This combination delivers 100+ high-signal conversations per week without triggering LinkedIn's spam detection. The math works out to 375 connections per week (75/day × 5 days) plus additional conversations through groups, events, and replies.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">From Manual to Automated</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">The fastest-growing teams don't execute this system manually forever. Once you've proven the approach works, the smart move is systematic automation that maintains safety while scaling your efforts.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Tiger automates this entire playbook safely and in the background:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Sends blank invites</strong> with proper spacing and follow-ups</li>
            <li className="mb-2"><strong>Pauses automatically</strong> when someone replies to prioritize conversations</li>
            <li className="mb-2"><strong>Keeps you under LinkedIn's radar</strong> with human-like behavior patterns</li>
            <li className="mb-2"><strong>Works with multiple sources:</strong> LinkedIn searches, Events, post engagement, CSV uploads</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">The result is consistent outreach that runs while you focus on product development, customer conversations, and closing deals.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The Bottom Line</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">This is how top startups stay consistent, stay compliant, and book meetings at scale. You can execute it manually to start, then automate with tools like Tiger when you're ready to scale.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Either way, you now have the system that lets you move at startup speed without breaking LinkedIn's rules or risking your account.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">The founders who master this playbook don't just survive the early-stage hustle—they thrive because they've solved the distribution problem that kills most startups before they ever get a real chance to succeed.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Ready to Put This System on Autopilot?</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Tiger helps founders automate this entire playbook safely and in the background. You focus on building your product and serving customers—Tiger handles the relationship building that keeps opportunities flowing.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><a href="https://icptiger.com" className="text-[#0A66C2] hover:underline">Try Tiger free for 7 days</a> and see how the right automation can turn this manual playbook into a consistent growth engine that works while you sleep.</p>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete LinkedIn Limit Bypass Playbook</h3>
          <p className="font-outfit text-gray-700 mb-4">Want the full strategy? Get our detailed guide to safely bypassing LinkedIn limits and scaling your outreach while staying compliant.</p>
          <a href="/Limits.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <PDFViewer pdfUrl="/Limits.pdf" />
        </section>
      </>
    ),
  },
  {
    id: 8,
    slug: 'build-your-network-while-you-sleep',
    title: 'Build Your Network While You Sleep: The 5-Step System That Scales',
    summary: "Learn how successful founders build systematic distribution without becoming full-time content creators. Discover the 5-step system that turns networking from a time sink into a competitive advantage that compounds while you sleep.",
    date: '2025-07-25',
    author: 'Tarun Sivakumar',
    seoDescription: 'A practical guide for founders to build systematic distribution and grow their network without sacrificing time needed for building their business.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 mb-4">You know those founders who seem to effortlessly attract investors, top talent, and customers? The ones who get introduced to exactly the right people at exactly the right time?</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">They're not just lucky. They're not naturally more charismatic. And they definitely didn't start with better networks than you.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">What they figured out early is this: building a startup in complete anonymity is like trying to raise money with a pitch deck no one ever sees. You can have the best product, the strongest metrics, and the clearest vision—but if the right people don't know you exist, none of it matters.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Most founders resist this reality because they think "personal branding" means becoming a LinkedIn influencer or Twitter personality. They imagine spending hours crafting posts, responding to comments, and chasing viral content instead of building their actual business.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">But here's what the successful ones actually do: they build systematic distribution that works in the background while they focus on what matters. They show up consistently to the right people without turning content creation into a second full-time job.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The Invisible Startup Problem</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">The hard truth: if you're not showing up, your startup isn't either. Founders who stay invisible stay unfunded, unhired, and overlooked.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">This isn't about ego or personal fame. It's about market reality. People don't trust companies—they trust founders. That trust is what drives fundraising conversations, attracts top talent, converts early customers, and opens partnership opportunities.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">When investors are deciding between two similar startups, they back the founder they know and trust. When great candidates are choosing between offers, they join the team led by someone they've heard of and respect. When customers are evaluating new solutions, they buy from founders who've demonstrated competence publicly.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Your competition isn't just building better products—they're building better visibility.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The Content Trap That Stops Most Founders</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Most founders hit the same wall when they try to build distribution:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>No time to write every day</strong> while also building the actual business</li>
            <li className="mb-2"><strong>No system for outreach</strong> beyond hoping people discover them organically</li>
            <li className="mb-2"><strong>No idea what to say</strong> that doesn't sound like generic startup advice</li>
            <li className="mb-2"><strong>No signal that it's working</strong> so they can't tell if they're wasting time</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">So they just stop. They convince themselves that great products sell themselves, that word-of-mouth will be enough, that they'll focus on distribution "later" when they have more time.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">But later never comes. And the founders who started building their distribution early keep pulling further ahead.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">What Actually Works (And It's Simpler Than You Think)</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">The founders winning at distribution aren't doing anything complicated:</p>
          <ol className="list-decimal pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Build a network of people who care</strong> about what you're building</li>
            <li className="mb-2"><strong>Say smart things regularly</strong> so they remember you exist</li>
            <li className="mb-2"><strong>Nudge the right ones toward action</strong> when you need something specific</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 mb-4">You don't need millions of views or thousands of followers. You need 500 of the right people to notice when you post, remember your name when opportunities arise, and think of you when they have relevant needs.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Quality over quantity. Signal over noise. Strategic over viral.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The 5-Step System: From Anonymous to Trusted</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Here's the systematic approach that works for founders who want distribution without becoming full-time content creators:</p>
        </section>

        <section className="mb-10">
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Step 1: Nail Your Audience (For You, Not Your Product)</h3>
          <p className="font-outfit text-lg text-gray-700 mb-4">Before you post anything, get clear on who should be seeing your name every week. This isn't your product's target market—it's your personal audience as a founder.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Are you trying to reach VCs for your next round? Other founders who might become partners or advisors? Heads of growth who could become customers? Senior engineers you want to hire?</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Pick one primary audience and optimize everything for them. You can expand later, but starting with focus gives you clarity on what to share and where to find the right people.</p>
        </section>

        <section className="mb-10">
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Step 2: Grow Your Network With Intent</h3>
          <p className="font-outfit text-lg text-gray-700 mb-4">Use LinkedIn's advanced search to systematically find high-relevance profiles. Filter by title, company size, industry, region, or any other criteria that define your ideal audience.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">These aren't just social media connections—they're your future hires, customers, and investors. Don't let them sit cold in your search results. Connect thoughtfully and consistently.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Aim for 80-100 strategic connections per week. This isn't about hitting some arbitrary follower count—it's about building genuine relationships with people who matter for your business.</p>
        </section>

        <section className="mb-10">
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Step 3: Share Things Worth Caring About</h3>
          <p className="font-outfit text-lg text-gray-700 mb-4">You don't need to become a thought leader overnight. You just need to share honest signal from the trenches. Here are formats that consistently work for founders:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>"Here's what worked for us"</strong> (tactical wins your audience can apply)</li>
            <li className="mb-2"><strong>"This almost killed us"</strong> (lessons learned from near-failures)</li>
            <li className="mb-2"><strong>"Nobody talks about this, but..."</strong> (contrarian insights from your experience)</li>
            <li className="mb-2"><strong>"Why we made this unpopular decision"</strong> (transparent reasoning behind tough choices)</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">The goal isn't to go viral—it's to demonstrate competence and judgment to people who are evaluating whether they want to work with you, invest in you, or buy from you.</p>
        </section>

        <section className="mb-10">
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Step 4: Engage, Don't Just Broadcast</h3>
          <p className="font-outfit text-lg text-gray-700 mb-4">Content creation is only half the equation. The real leverage comes from treating distribution like sales, not just storytelling.</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Comment meaningfully</strong> on posts from people in your target audience</li>
            <li className="mb-2"><strong>Follow up</strong> with people who engage with your content</li>
            <li className="mb-2"><strong>DM anyone</strong> who seems curious about what you're building</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">This isn't about being pushy—it's about turning passive followers into active relationships. Most founders post and hope people reach out. Smart founders use content as the opening to start conversations.</p>
        </section>

        <section className="mb-10">
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Step 5: Automate the Boring Parts</h3>
          <p className="font-outfit text-lg text-gray-700 mb-4">Once you've proven what works manually, don't keep doing everything by hand forever. The repetitive parts of network building and outreach should run in the background while you focus on high-value activities.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">This is where Tiger becomes essential:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Import leads</strong> from any LinkedIn search you create</li>
            <li className="mb-2"><strong>Auto-send invites and messages</strong> at human speeds and timing</li>
            <li className="mb-2"><strong>Track replies, clicks, and conversions</strong> so you know what's working</li>
            <li className="mb-2"><strong>Manage team accounts</strong> from one dashboard if you have co-founders</li>
            <li className="mb-2"><strong>Stay compliant</strong> with LinkedIn's limits and policies</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">No browser hacks, no risky plugins, no account bans. Just systematic relationship building that scales without consuming your time.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The Compound Effect of Consistent Distribution</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Founders don't win because they post more content or have bigger followings. They win because the right people keep hearing their name.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">When you show up consistently to a focused audience, several things happen automatically:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Opportunities find you</strong> instead of you having to chase them</li>
            <li className="mb-2"><strong>Warm introductions</strong> replace cold outreach for important conversations</li>
            <li className="mb-2"><strong>Credibility compounds</strong> as people see evidence of your thinking and progress over time</li>
            <li className="mb-2"><strong>Network effects accelerate</strong> as your connections introduce you to their connections</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">This isn't about personal fame—it's about making your startup impossible to ignore by the people who matter most for its success.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Ready to Build Your Distribution Engine?</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Tiger helps founders build systematic distribution without turning into full-time content creators. You focus on building your product and serving customers—Tiger handles the relationship building that keeps opportunities flowing.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><a href="https://icptiger.com" className="text-[#0A66C2] hover:underline">Try Tiger free for 7 days</a> and see how the right system can turn networking from a time sink into a competitive advantage that compounds while you sleep.</p>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete Distribution Playbook</h3>
          <p className="font-outfit text-gray-700 mb-4">Want the full strategy? Get our detailed guide to building systematic distribution that works while you sleep.</p>
          <a href="/2. FounderDistribution.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <PDFViewer pdfUrl="/2. FounderDistribution.pdf" />
        </section>
      </>
    ),
  },
  {
    id: 7,
    slug: 'linkedin-ssi-score-killing-outreach',
    title: 'Your LinkedIn SSI Score Is Killing Your Outreach (Here\'s How to Fix It)',
    summary: "Discover why your LinkedIn outreach isn't failing because of your message, but because of your Social Selling Index (SSI). Learn how successful founders use this hidden score as their secret weapon for better reach and response rates.",
    date: '2025-07-15',
    author: 'Adhiraj Hangal',
    seoDescription: 'Learn how to optimize your LinkedIn Social Selling Index (SSI) to dramatically improve your outreach success rate and build meaningful business relationships.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 mb-4">Here's the uncomfortable truth: your cold outreach isn't failing because of your message. It's failing because LinkedIn doesn't trust you enough to deliver it.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">While you're A/B testing subject lines and tweaking your pitch, successful founders are optimizing something completely different—their Social Selling Index. It's the invisible score that determines whether your messages actually reach inboxes, whether people take you seriously when they see your name, and whether your outreach feels cold or familiar.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Most founders have never heard of SSI. The ones crushing it on LinkedIn treat it like their secret weapon.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The Hidden Algorithm Killing Your LinkedIn Outreach</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">If you're sending DMs on LinkedIn with a weak profile, you're fighting an uphill battle you don't even know exists.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">LinkedIn's algorithm doesn't just decide who sees your posts—it also determines whether your messages actually reach people's inboxes. A low Social Selling Index (SSI) means fewer deliveries, lower trust signals, and ultimately fewer replies. A high SSI means more visibility, instant credibility, and significantly better response rates.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">This is your silent leverage. While other founders are obsessing over message templates and sending volume, the smartest ones are optimizing the system that determines whether their outreach gets seen at all.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">What Is Your Social Selling Index (And Why It Matters)</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Your Social Selling Index is LinkedIn's score of how effectively you use the platform for relationship building. It's measured out of 100 and broken down across four key areas:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Brand:</strong> How complete and compelling your profile is</li>
            <li className="mb-2"><strong>Network:</strong> How strategically you're building connections</li>
            <li className="mb-2"><strong>Engagement:</strong> How actively you participate in conversations</li>
            <li className="mb-2"><strong>Relevance:</strong> How well you find and connect with the right people</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">Most founders completely ignore this score. The smart ones treat it like a competitive advantage because it directly impacts their ability to reach decision-makers in their market.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Your Profile Isn't a Resume—It's a Landing Page</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Let's start with the foundation: your LinkedIn profile. Most founders treat this like an online resume, listing their education and job history. But your profile is actually a landing page that needs to convert visitors into conversations.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Your headline</strong> should immediately communicate who you help and how, not just your job title. Instead of "CEO at TechStartup," try "Helping SaaS founders scale from $1M to $10M ARR."</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Your banner</strong> should build instant trust through social proof—customer logos, key metrics, or a clear value proposition. This is prime real estate that most founders leave blank or fill with generic imagery.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><strong>Your summary</strong> should tell a story that makes someone want to message you. If someone scrolls through your profile, they should come away thinking "I should talk to this person" rather than "that's nice."</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Build a Network That Compounds</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Growing your network isn't about adding random people to hit some arbitrary connection number. It's about strategically building relationships with people who matter for your business.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Prioritize connecting with:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Potential buyers</strong> in your target market</li>
            <li className="mb-2"><strong>Key candidates</strong> you might want to hire</li>
            <li className="mb-2"><strong>Relevant investors</strong> for your stage and sector</li>
            <li className="mb-2"><strong>Industry participants</strong> who are actively engaging in your space</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">Aim for 80-100 intentional connections per week. Not volume for its own sake—relevance. Each connection should have a strategic reason behind it.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Track Your Score and Fix What's Broken</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Want to see your actual SSI score? Go to linkedin.com/sales/ssi—it updates daily and shows you exactly where you stand in each category.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Use this as a diagnostic tool to identify what's holding you back:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Low Brand score?</strong> Your profile needs work—better headline, banner, or summary</li>
            <li className="mb-2"><strong>Low Engagement score?</strong> Start commenting meaningfully on your ideal customer's posts</li>
            <li className="mb-2"><strong>Low Relevance score?</strong> Rebuild your connection strategy around your actual target market</li>
            <li className="mb-2"><strong>Low Network score?</strong> Focus on adding the right people, not just the most people</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">This isn't a vanity metric—it's a feedback loop that tells you how effectively you're using LinkedIn as a business development tool.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Show Up Consistently (But Don't Overthink It)</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Even posting 1-2 times per week changes everything. You don't need to go viral or become a thought leader overnight. You just need to be remembered when someone in your network has a relevant need.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Share what you're building, what's breaking, and what you're learning. Founders who post with authentic context build warmth at scale. When you eventually message someone, you're not starting from zero—you're building on existing familiarity.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">The goal isn't to become LinkedIn famous. It's to ensure that when people in your network think about your problem space, your name comes to mind.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Turn Cold Outreach Into Warm Conversations</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Here's where the SSI optimization pays off: when you finally do message someone, it's not actually cold anymore.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">They've seen your face in their feed. Maybe they've read one of your posts or seen you comment on something relevant. You've established yourself as a real person with legitimate expertise rather than just another random founder sliding into DMs.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Now when you message with context about their recent post or company news, it lands differently. You're not an interruption—you're a familiar face starting a relevant conversation.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Advanced Strategy: Combine SSI with Smart Targeting</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Want to take this further? Combine your optimized SSI with LinkedIn's advanced search filters.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Here's the process that works:</p>
          <ol className="list-decimal pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Search strategically:</strong> "Head of Growth" at Series A-C companies, 11-50 employees</li>
            <li className="mb-2"><strong>Filter by activity:</strong> Sort by people who've posted recently (they're more likely to be active)</li>
            <li className="mb-2"><strong>Build familiarity first:</strong> View their profile, like or comment on their content</li>
            <li className="mb-2"><strong>Connect with context:</strong> Send a connection request referencing something specific</li>
            <li className="mb-2"><strong>Message after connecting:</strong> Now your DM feels like a natural continuation</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 mb-4">Cold becomes familiar, and familiar gets replies. This systematic approach consistently outperforms spray-and-pray messaging.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">The Target That Actually Matters</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Aim for an SSI above 70. At this level, your messages deliver consistently, your profile converts visitors into conversations, and your network becomes a genuine business asset.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">But remember: this isn't about gaming a number. It's about becoming un-ignorable to the people who matter for your business. When your SSI is optimized, every outreach effort becomes more effective because you've built the foundation that makes people want to engage with you.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-6 text-gray-900">Automate What Works, Keep What's Human</h2>
          <p className="font-outfit text-lg text-gray-700 mb-4">Once you've optimized your SSI and proven your outreach approach manually, you shouldn't keep doing everything by hand forever. The goal is to systematize the parts that scale while maintaining the human touch where it matters.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4">Tiger helps founders run this entire system in the background:</p>
          <ul className="list-disc pl-6 mb-4 font-outfit text-lg text-gray-700">
            <li className="mb-2"><strong>Warm up leads automatically</strong> by engaging with their content before reaching out</li>
            <li className="mb-2"><strong>Track reply rates</strong> across different message types and target segments</li>
            <li className="mb-2"><strong>Stay visible</strong> through consistent, strategic engagement</li>
            <li className="mb-2"><strong>Maintain high SSI</strong> through systematic network building and activity</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 mb-4">The result? Your LinkedIn presence works for you 24/7, building relationships and generating opportunities while you focus on building your product and serving customers.</p>
          <p className="font-outfit text-lg text-gray-700 mb-4"><a href="https://icptiger.com" className="text-[#0A66C2] hover:underline">Try Tiger free for 7 days</a> and see how combining SSI optimization with smart automation can turn LinkedIn into your most effective business development channel.</p>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Full SSI Playbook</h3>
          <p className="font-outfit text-gray-700 mb-4">Want to dive deeper? Get our complete guide to optimizing your LinkedIn Social Selling Index and turning it into your competitive advantage.</p>
          <a href="/SSI.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <PDFViewer pdfUrl="/SSI.pdf" />
        </section>
      </>
    ),
  },
  {
    id: 6,
    slug: 'three-pipelines-every-founder-needs',
    title: 'The 3 Pipelines Every Founder Needs (And How to Build Them Systematically)',
    summary: "Your biggest competitor isn't another startup—it's the founder who built systems while you're still doing everything manually. Learn the exact process that turns relationship building from a time sink into your competitive advantage.",
    date: '2025-07-01',
    author: 'Adhiraj Hangal',
    seoDescription: 'Learn how successful founders build systematic processes for reaching the right people, from potential hires to customers and investors, without letting it become a full-time job.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Your biggest competitor isn't another startup. It's the founder who figured out how to systematically reach the right people while you're still hoping for warm intros.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most founders treat relationship building like it's optional—something they'll "get to" after they ship the next feature. But the best founders know that building relationships with hires, customers, and investors isn't separate from building their company. It *is* building their company.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">While you're perfecting your product in isolation, they're having conversations that shape their roadmap, validate their assumptions, and open doors you didn't even know existed.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The difference isn't that they're better networkers or more charismatic. They've just built tiny, repeatable systems that compound over time. Here's exactly how they do it.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Manual Trap That's Killing Your Momentum</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Still doing any of this manually?</p>
          <ol className="list-decimal pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Scraping LinkedIn profiles one by one</li>
            <li>Crafting individual 1:1 messages from scratch</li>
            <li>Forgetting to follow up with promising conversations</li>
            <li>Letting warm leads go cold while you focus on product</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">It's not just time you're wasting—it's momentum. Every manual process is a bottleneck that slows down your ability to build the three relationships that actually matter for your startup's survival.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">How the Best Founders Actually Operate</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The best founders don't wait around for warm intros or hope their latest tweet goes viral. They build tiny, compounding systems that reach the right people every single week.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The formula is simple: <strong>Show up → spark context → stay top of mind.</strong> All while shipping product and building the actual business.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">They understand that consistent, systematic outreach isn't a distraction from building—it's part of building. Every conversation with a potential hire, customer, or investor teaches you something that makes your product and strategy better.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Only 3 Pipelines That Matter</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">There are only three types of people you need to stay alive as a founder:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li><strong>People who can build with you</strong> (hires, advisors, co-founders)</li>
            <li><strong>People who want to buy from you</strong> (customers, users, early adopters)</li>
            <li><strong>People who might back you</strong> (angels, VCs, strategic investors)</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Everything else is noise. Don't chase scale—chase signal. Your job isn't to reach everyone; it's to systematically reach the right people in each of these three categories.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 1: Build Micro-CRMs (Not Tools, Lists)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Forget expensive CRM software. Start with three simple lists:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li><strong>One for candidates</strong> you might want to hire</li>
            <li><strong>One for customers</strong> who fit your ideal profile</li>
            <li><strong>One for angels and funds</strong> that invest in your stage and sector</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Pull them from LinkedIn. Filter by title, company size, funding stage, or whatever criteria matter for your business. Update them weekly as you discover new people or companies.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">That's your battlefield. These aren't static lists—they're living documents that grow as you learn more about your market and ideal profiles.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 2: Watch for Signals (Don't Spray and Pray)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Don't send cold messages to everyone on your lists. Wait for something—anything—to warm up the conversation:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>They changed jobs (new role, new priorities)</li>
            <li>They posted something relevant to your space</li>
            <li>They viewed your LinkedIn profile</li>
            <li>They followed your co-founder or engaged with your content</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">One signal is all it takes. That's your opening to start a relevant, timely conversation instead of another generic cold pitch.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 3: Use Sequencing, Not Scripts</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's the cadence that actually works:</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Connect → Light touch → Soft follow-up → Drop value → Clear CTA</strong></p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most people quit after one DM and wonder why their "outreach doesn't work." But every step in the sequence is a new chance to land the conversation. The real leverage lives in the follow-up—that's where relationships actually get built.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Each touchpoint should feel natural and add something new to the conversation, not just repeat the same ask in different words.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 4: Don't Get Blocked (Play by LinkedIn's Rules)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">LinkedIn has rules. Don't break them. Instead, get creative about how you show up:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li><strong>Message inside groups</strong> where you're both members</li>
            <li><strong>Join events and DM attendees</strong> who are clearly interested in your space</li>
            <li><strong>Engage with mutuals</strong> to get on someone's radar before reaching out</li>
            <li><strong>Use co-founder accounts strategically</strong> to expand your reach</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">It's not about spamming or gaming the system. It's about showing up across multiple surfaces so when you do reach out directly, you're not a complete stranger.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 5: Learn from Every Response (Including Silence)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This is where most founders miss the biggest opportunity. Every interaction teaches you something:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li><strong>Who's biting?</strong> What types of people are most responsive?</li>
            <li><strong>Which lines fall flat?</strong> What messaging isn't resonating?</li>
            <li><strong>Where do people click but ghost?</strong> What's the disconnect between interest and action?</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This isn't just "ops"—it's early-stage go-to-market research. Treat it like product development: hypothesis, test, measure, iterate.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Level Up: Advanced Optimization Tactics</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once your basic system is running, here's how to maximize results:</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>A/B test your CTAs:</strong> "Any interest?" vs. "Want to try?" vs. "Worth a quick test?" Small changes in how you ask can dramatically impact response rates.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Bucket your replies:</strong> Sort responses into categories like "curious," "cold," "hiring soon," "not now." Then tailor your follow-ups accordingly instead of using the same sequence for everyone.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Tag ghosters for re-engagement:</strong> People who went quiet aren't dead leads. Re-engage them 4-6 weeks later with something new—a case study, product demo, or company update.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Score your lists:</strong> Track who's actually engaging with your outreach and content. Double down on those personas and de-prioritize the ones that consistently ignore you.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Good outreach doesn't just scale—it learns and adapts based on real market feedback.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The System That Runs Itself</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once you've proven this approach works manually, you shouldn't keep doing everything by hand forever. The best founders automate the repetitive parts while keeping the human touch where it matters—in the actual conversations.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This is exactly why we built Tiger. It runs this entire system quietly in the background, letting you focus on product development and the strategic conversations that actually move your startup forward.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Tiger handles:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li><strong>Systematic list building</strong> from your ideal customer profiles</li>
            <li><strong>Signal detection</strong> to time your outreach perfectly</li>
            <li><strong>Sequence automation</strong> that feels human, not robotic</li>
            <li><strong>Performance tracking</strong> so you can optimize what's working</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The result? Consistent pipeline development across all three critical relationships—hires, customers, and investors—without the manual overhead that kills momentum.</p>
          <div className="font-outfit text-xl text-center text-[#0A66C2] font-semibold mt-8">
            <a href="/sign-up" className="underline hover:text-[#084b8a]">Try Tiger free for 7 days</a>
          </div>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete Founder Ops Guide</h3>
          <p className="font-outfit text-gray-700 mb-4">Want to dive deeper? Get our complete guide to building systematic processes that turn relationship building from a time sink into your competitive advantage.</p>
          <a href="/founderops.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <PDFViewer pdfUrl="/founderops.pdf" />
        </section>
      </>
    ),
  },
  {
    id: 5,
    slug: 'from-feast-to-predictable',
    title: 'From Feast to Predictable: Turn LinkedIn Into Your Client Machine',
    summary: 'Break free from the feast-or-famine cycle. Learn the systematic approach that turns LinkedIn from a time sink into a predictable client acquisition engine—no sleazy tactics, no spray-and-pray messaging.',
    date: '2025-06-25',
    author: 'Adhiraj Hangal',
    seoDescription: 'Learn how service founders can build a systematic LinkedIn outreach process to consistently attract qualified clients without relying on random content virality or cold outreach.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">You know that sick feeling when your best client just wrapped up their project and your pipeline is... empty?</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most service founders live in this feast-or-famine cycle. You're either buried in client work (no time for sales) or desperately hustling for your next deal (no money coming in). The "just create valuable content" advice sounds great until you realize you need clients this month, not next year.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's what actually works: the systematic approach that lets you fill your calendar with qualified prospects while you focus on delivering great work. No sleazy tactics, no spray-and-pray messaging, no praying your latest LinkedIn post goes viral.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This is the playbook that turns client acquisition from a constant stress into a predictable system.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Silent Pain of "Doing Everything Right"</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">You're probably doing everything the LinkedIn gurus tell you to do:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Posting valuable content consistently</li>
            <li>Updating your profile with keywords and social proof</li>
            <li>Engaging daily with comments and reactions</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">But leads are still random. Your DMs are mostly dry. And every month feels like starting from scratch, wondering if this will be the month you finally crack the code on predictable client acquisition.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's the thing: you're not doing it wrong. You're just missing the distribution engine that turns your good content and strong positioning into actual conversations with people who need what you offer.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 1: Know What "Ready to Buy" Actually Looks Like</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Stop waiting to be discovered. Instead, actively look for real buying signals on LinkedIn:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Just changed roles (new job, new problems to solve)</li>
            <li>Hiring for what you offer (trying to build in-house first, often unsuccessfully)</li>
            <li>Mentioning pain points in posts (publicly talking about challenges you solve)</li>
            <li>Engaging with your competitors (already in the market, comparing options)</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">These people aren't cold prospects—they're warm leads who just don't know you exist yet. Your job is to start relevant conversations with people who are already leaning in.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 2: Search Like a Founder, Not a Marketer</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Use LinkedIn's advanced filters strategically:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Titles: "Founder," "Head of Growth," "Marketing Lead," or whatever your ideal client calls themselves</li>
            <li>Keywords: Industry-specific terms like "newsletter," "ops," "ghostwriter," or problems you solve</li>
            <li>Activity: Posted in the last 30 days (shows they're active and reachable)</li>
            <li>Past companies: Places where your best clients have worked before</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Bonus tip: People who recently viewed your profile are warm leads. They're already curious about what you do—reach out with context about why they might have checked you out.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 3: Start Conversations That Don't Sell</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Your cold DMs shouldn't feel cold. Instead of pitching, ask relevant questions that show you've done your homework:</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">"Saw you're hiring for content. Are you building in-house or still figuring it out?"</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">"Noticed you're scaling your offer—how are you approaching lead gen right now?"</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Short. Specific. Human. These messages work because they're about them, not about you. You're starting a conversation about a challenge they're facing, not making a sales pitch.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 4: Make Your Profile Convert (Silently)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once someone checks your profile after receiving your message, it should answer four things immediately:</p>
          <ol className="list-decimal pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Who you help (be specific about your ideal client)</li>
            <li>What you help them achieve (the outcome, not the process)</li>
            <li>Why they should trust you (proof, not promises)</li>
            <li>How to take the next step (clear call-to-action)</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">No fluff. No generic buzzwords. Just clarity about what you do and why someone should care.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Your profile is doing sales work while you sleep—make sure it's actually effective at converting curious visitors into interested prospects.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 5: Build the Anti-Cringe Follow-Up System</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most deals die in silence, not rejection. But most service founders either don't follow up at all (because it feels pushy) or they send desperate "just checking in" messages that make things worse.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Follow up like a human with context and value:</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">"Just bubbling this up in case it slipped through—still something you're looking at?"</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">"Quick ping—helped 3 others fix this exact issue last month. Want me to send over how we approached it?"</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">No pressure. Just context and a gentle reminder that you're there when they're ready to continue the conversation.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 6: Test Before You Scale</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This is where most service founders mess up: they jump straight to automation without knowing if their messaging actually works.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Before you automate anything, do this:</p>
          <ol className="list-decimal pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Write 3 different message variations</li>
            <li>Send 10 of each manually to similar prospects</li>
            <li>Track reply rates and conversation quality</li>
            <li>Keep the winner, kill the rest</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">If a message doesn't work when you send 10 manually, it won't work when you send 100 automatically. Save yourself the embarrassment and test first.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Step 7: Build Your Weekly Growth Engine</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once you know what works, create a repeatable weekly rhythm:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>100 targeted connections with your ideal prospects</li>
            <li>15-30 contextual DMs to people showing buying signals</li>
            <li>1-2 positioning posts that attract your ideal clients</li>
            <li>5 follow-ups to previous conversations</li>
            <li>Track reply rates and results to keep improving</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">No ads. No expensive agencies. Just systems that you control and can improve over time.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This isn't about volume—it's about consistency. A predictable weekly process that generates conversations with the right people.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">When It's Time to Scale (And How to Do It Right)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once you're getting consistent replies and your profile is converting visitors into conversations, you shouldn't keep doing everything manually forever.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">That's when you add leverage:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Automate connection requests to people matching your ideal client profile</li>
            <li>Send your top-performing messages automatically to qualified prospects</li>
            <li>Let replies come in while you focus on client work and closing deals</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">You're not spamming because you're scaling what already works. You've tested the messaging, refined the targeting, and proven the process manually first.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Proof Is in the Pipeline</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This exact system has helped multiple service founders go from random, unpredictable leads to consistent pipeline without ads, VAs, or spam tactics.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">It works because it's built around what people actually respond to: relevant, timely outreach from someone who understands their situation and can help solve real problems.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Your Weekly Client Engine (Save This)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's your repeatable system:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>100 targeted connections with buying-signal prospects</li>
            <li>15-30 high-context DMs based on recent activity or changes</li>
            <li>1-2 high-signal posts that attract your ideal clients</li>
            <li>5 low-pressure follow-ups to keep conversations alive</li>
            <li>Track what works, kill what doesn't to continuously improve</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once this works manually, automate the busywork but keep the human touch where it matters—in the actual conversations that lead to clients.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Ready to Put Your Client Acquisition on Autopilot?</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once you've proven this system works manually, Tiger can help you scale it without losing the personal, relevant approach that makes it effective.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Tiger helps service founders:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Connect with your specific niche automatically</li>
            <li>Send your proven messages to qualified prospects</li>
            <li>Stay visible to ideal clients without doing it all by hand</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The result? More time for client work, more predictable pipeline, and less stress about where your next client will come from.</p>
          <div className="font-outfit text-xl text-center text-[#0A66C2] font-semibold mt-8">
            <a href="/sign-up" className="underline hover:text-[#084b8a]">Try Tiger free for 7 days</a>
          </div>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete Service Founder's Guide</h3>
          <p className="font-outfit text-gray-700 mb-4">Want to dive deeper? Get our complete guide to turning LinkedIn from a time sink into a predictable client acquisition engine.</p>
          <a href="/service-founders.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <PDFViewer pdfUrl="/service-founders.pdf" />
        </section>
      </>
    ),
  },
  {
    id: 4,
    slug: 'technical-founders-guide-to-selling',
    title: 'The Technical Founder\'s Guide to Selling Without Selling Out',
    summary: 'Without hiring a rep. Without selling their soul. Learn how technical founders can leverage their unique advantages to sell effectively without compromising who they are.',
    date: '2025-06-20',
    author: 'Adhiraj Hangal',
    seoDescription: 'Learn how technical founders can succeed at sales by leveraging their unique advantages, using a diagnostic approach, and scaling what works with authentic outreach.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most technical founders struggle with sales. Not because they're bad at it, but because they're doing it like a salesperson—not a founder.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's the thing: you have advantages that professional salespeople don't. You built the product. You understand the problem better than anyone. You can make decisions on the spot. But instead of leveraging these strengths, most founders try to copy the playbook of smooth-talking sales reps.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This is the approach that actually works for YC teams and technical founders who've figured out how to sell without compromising who they are.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">1. Diagnose. Don't Pitch.</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Sales isn't about convincing someone to buy something they don't need. It's about discovering whether you can solve a problem they already have.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The best founders sell like doctors: they ask questions, they listen carefully, and then they prescribe a solution. They don't walk into every conversation with the same pitch—they adapt based on what they learn.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Start Every Sales Call With These 3 Questions:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>"What's the painful part of [X] right now?"</li>
            <li>"What have you tried already?"</li>
            <li>"What would make this feel solved?"</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">If they don't have real pain around the problem you solve, there's nothing to sell. And that's okay—it's better to find out in the first five minutes than waste an hour trying to create urgency where none exists.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This approach feels natural for technical founders because it's essentially debugging. You're gathering information, understanding the system, and identifying where things are breaking down.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">2. Write Like a Founder, Not a Rep</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most cold emails sound like they came from a marketing automation tool. They're generic, overly polished, and clearly mass-produced. Founders have an unfair advantage here: you're real, you're building something specific, and you can speak authentically about problems you've actually solved.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Instead of:</strong><br/>"Hi {`{{first name}}`}, we help companies like yours improve {`{{metric}}`} by up to 40%..."</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Try:</strong><br/>"Hey - saw you're hiring BDRs. Curious if outbound is actually working or still a pain?"</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The difference is obvious. The first message could have been sent by any SaaS company to any prospect. The second message shows you've done your homework and you're asking about a specific challenge they're likely facing right now.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Short. Specific. No fluff. This is how founders actually communicate—don't abandon that authenticity when you're trying to sell.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Cold Truth About Cold Outreach</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's the reality check every founder needs: <strong>if your cold messages aren't getting replies when you send them manually, automating them won't fix the problem—it'll just help you get ignored faster.</strong></p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">You don't have a sending problem. You have a <strong>messaging</strong> problem.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most founders jump straight to automation tools because manual outreach feels inefficient. But efficiency doesn't matter if your message doesn't work. It's like optimizing a broken funnel—you're just scaling failure.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>How to Fix Your Messaging Before You Scale:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Write 3 different versions of your core message</li>
            <li>Send each one manually to 5-10 people in your target market</li>
            <li>Track which version gets the most replies</li>
            <li>Double down on what works and iterate on what doesn't</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Outbound isn't guessing—it's systematic iteration. Treat it like you'd treat any other part of building your product: hypothesis, test, measure, improve.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">3. Follow Up Like a Human</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most deals die in silence, not in rejection. If you don't follow up, you're wasting 80% of your outreach effort. But most founders either don't follow up at all (because it feels pushy) or they send robotic "bump" messages that make things worse.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Your follow-ups should feel like a natural continuation of the conversation, not a desperate attempt to get attention.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>Use These Templates:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>"Just bubbling this up in case it slipped through—still something you're looking at?"</li>
            <li>"Quick ping—we've helped 3 teams fix this exact issue last month. Want to see if it's relevant for you?"</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">No "bump." No pressure. Just context and a gentle reminder that you're there when they're ready to continue the conversation.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Evolution: From Manual to Scalable</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Founder-led sales starts manual—but it shouldn't stay that way forever.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">You need to figure out what works by doing it yourself first. This isn't just about learning the market or understanding your customers (though both are valuable). It's about developing a repeatable process that you can eventually hand off or automate.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The sequence looks like this:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Manual outreach to learn what messages work</li>
            <li>Systematic testing to refine your approach</li>
            <li>Process documentation so you can repeat what works</li>
            <li>Selective automation for the parts that don't require your personal touch</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most founders skip steps 2 and 3 and jump straight from manual chaos to hoping automation will solve everything. That's why their outbound efforts plateau or fail completely.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Why Founder-Led Sales Actually Works</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">When done right, founder-led sales has massive advantages over traditional sales approaches:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Instant credibility: People want to talk to the person building the solution</li>
            <li>Technical depth: You can answer any question about how your product works</li>
            <li>Decision-making speed: No need to "check with the team" on pricing or features</li>
            <li>Authentic passion: Your enthusiasm for solving the problem is genuine</li>
            <li>Flexible solutions: You can adapt your product roadmap based on what you learn</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The key is leveraging these advantages instead of trying to sound like everyone else.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Ready to Scale What Works?</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Once you've cracked the code on messaging that gets replies and conversations that convert, you need leverage to reach more of the right people consistently.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Tiger helps technical founders scale their proven outreach without losing the authentic, human approach that makes founder-led sales work. You keep the personal touch where it matters—in the conversations—while automating the repetitive parts of finding and reaching prospects.</p>
          <div className="font-outfit text-xl text-center text-[#0A66C2] font-semibold mt-8">
            <a href="/sign-up" className="underline hover:text-[#084b8a]">Try Tiger free for 7 days</a>
          </div>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete Technical Founder's Guide</h3>
          <p className="font-outfit text-gray-700 mb-4">Want to dive deeper? Get our complete guide to helping technical founders win at sales without compromising who they are.</p>
          <a href="/TechnicalFounders.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <PDFViewer pdfUrl="/TechnicalFounders.pdf" />
        </section>
      </>
    ),
  },
  {
    id: 3,
    slug: 'secret-linkedin-filters-top-recruiters',
    title: 'The 5 Secret LinkedIn Filters Top Recruiters Don\'t Want You to Know',
    summary: 'Search smarter. Find sharper candidates. Spend less time chasing replies. Learn the exact filters top recruiters use to find pre-vetted candidates and get higher response rates.',
    date: '2024-06-27',
    author: 'Tarun Sivakumar',
    seoDescription: 'Discover 5 powerful LinkedIn search filters that help recruiters find better candidates faster, including past company filters, stealth job seekers, and active profiles.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Everyone filters by job title and location. That's why everyone finds the same people, sends messages to the same overloaded inboxes, and gets the same mediocre response rates.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">But the best candidates? They're just a few filters deeper.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The recruiters who consistently find fresh talent and get higher reply rates aren't using secret databases or expensive tools. They're just thinking one level beyond the obvious searches that everyone else is running.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Filter 1: Past Company (Not Current)</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The insight:</strong> The best people often just left the best companies.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Instead of competing with dozens of other recruiters messaging someone's current coworkers, focus on people who recently moved on from top-tier companies. These candidates are pre-vetted by their previous employer's hiring standards and often more open to conversations since they've already made one career move recently.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>How to use it:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Set "Past company = Stripe, Meta, Google, etc."</li>
            <li>Leave "Current company" blank to find recent leavers</li>
            <li>Check their activity to gauge openness to new opportunities</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">These profiles are pre-vetted, fresh, and usually more responsive than people who've been in the same role for years.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Filter 2: Stealth Job Seekers</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The insight:</strong> Not everyone uses the "Open to Work" badge, but many still signal their interest in other ways.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The smartest candidates don't broadcast their job search with LinkedIn's official badge—they're more subtle about it. But if you know where to look, they're sending clear signals in their headlines and about sections.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>How to use it:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Search for phrases like "open to work" OR "actively seeking"</li>
            <li>Look in the Headline and About sections, not just the official badge</li>
            <li>Combine with role-specific keywords to narrow your focus</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">These candidates have low competition from other recruiters but high intent to make a move. The result? Much easier replies and more productive conversations.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Filter 3: Groups = Intent-Based Gold Mines</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The insight:</strong> Groups show up in advanced search—and they're pure gold for finding engaged candidates.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">When someone joins a professional group, they're essentially raising their hand and saying "I care about this topic enough to opt into conversations about it." This is incredibly valuable context that most recruiters completely ignore.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>How to use it:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Filter by relevant groups like "Remote SDRs," "Tech Sourcers United," or "Women in DevOps"</li>
            <li>Message with context about the group they're in</li>
            <li>Reference shared interests or challenges specific to that community</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">These folks opted into a niche community. When you message with that context, your reply rates go up significantly because you're not just another random recruiter—you're someone who understands their professional interests.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Filter 4: Prioritize Active Profiles</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The insight:</strong> Dead inbox = no reply. Focus on people who are actually using LinkedIn.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This seems obvious, but you'd be surprised how many recruiters waste time messaging people who haven't logged into LinkedIn in months. Active users are simply more reachable, more likely to see your message, and more likely to respond.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>How to identify active profiles:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Look for posts or comments in the last 30 days</li>
            <li>Check for likes on hiring or industry content</li>
            <li>See if they follow companies in your space or related industries</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This simple filter can dramatically improve your response rates without changing anything about your messaging. You're just ensuring your messages reach people who are actually there to receive them.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Filter 5: Title + Keyword Combo</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The insight:</strong> Titles lie. You'll miss great candidates if you search by title alone.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The best engineers might have "Software Developer" in their title while doing advanced machine learning work. The most experienced sales leaders might be listed as "Account Executive" at a startup where everyone wears multiple hats.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>How to use it:</strong></p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Start with broader titles like "Engineer," "Developer," or "Manager"</li>
            <li>Add specific keywords like "Golang," "Kubernetes," "Distributed systems"</li>
            <li>Slice by years of experience if you need to narrow further</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This approach finds serious candidates who are hiding under generic titles or working at companies with non-standard role naming conventions. You'll discover talent that other recruiters miss because they're stuck searching only by exact title matches.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Problem With Better Searches</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's the catch: once you've built these sharper candidate lists, you still have to do something with them.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most recruiters hit this wall hard. They spend time crafting the perfect search, find a great list of candidates, and then face the reality of manually connecting and messaging each person one by one. Then tracking replies, setting follow-up reminders, and managing the entire process across multiple searches and roles.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This is where most sourcing pipelines stall. You don't need more effort at this stage—you need more leverage.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Solution: Automation That Actually Works</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Tiger turns any LinkedIn People search into clean, safe outreach that works while you focus on the conversations that matter.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The process is simple:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Paste your search URL into Tiger</li>
            <li>Set your message template</li>
            <li>Tiger scrolls, types, and sends messages like a real person would</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">No browser plugins to install. No profile scraping that gets you flagged. No robotic behavior that screams "automation tool." Just smart, recruiter-focused automation that respects LinkedIn's systems while scaling your outreach.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">While other tools try to blast through LinkedIn's limits as fast as possible, Tiger mimics human behavior—taking breaks, varying timing, and following the same patterns a real recruiter would use. This keeps your account safe while dramatically expanding what you can accomplish in a day.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Ready to Transform Your Sourcing?</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">These five filters will help you find better candidates faster. But the real breakthrough happens when you combine smarter searches with reliable automation.</p>
          <div className="font-outfit text-xl text-center text-[#0A66C2] font-semibold mt-8">
            <a href="/sign-up" className="underline hover:text-[#084b8a]">Try Tiger free for 7 days</a>
          </div>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete LinkedIn Filters Guide</h3>
          <p className="font-outfit text-gray-700 mb-4">Want to dive deeper? Get our complete guide to using LinkedIn's advanced filters to find better candidates faster.</p>
          <a href="/5-li-filters.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <PDFViewer pdfUrl="/5-li-filters.pdf" />
        </section>
      </>
    ),
  },
  {
    id: 2,
    slug: 'math-behind-every-successful-hire',
    title: 'The Math Behind Every Successful Hire: A Recruiter\'s Guide to Working Smarter',
    summary: "The 100-10-1 rule that top recruiters use to scale their results. Learn why sending 300 messages doesn't have to mean 300 copy-pastes, and how to build a system that works while you sleep.",
    date: '2025-06-10',
    author: 'Adhiraj Hangal',
    seoDescription: 'Learn about the hidden recruiting funnel that is causing burnout, and how top recruiters use metrics and automation to work smarter, not harder.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's the uncomfortable truth about recruiting: you're probably working twice as hard as you need to.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The best recruiters I know aren't superhuman. They don't work 70-hour weeks or have some secret talent for finding perfect candidates. What they do have is something more valuable: systems that work while they sleep.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">While average recruiters are clicking through profiles at 10 PM and rewriting the same message for the hundredth time, top performers are closing deals, building relationships, and actually enjoying their work. The difference isn't talent or effort—it's eliminating the manual work that keeps good recruiters trapped in busywork instead of focusing on what actually drives results.</p>
          
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Daily Grind That's Killing Your Results</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">What most recruiter workflows look like:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-8">
            <li>Click profile</li>
            <li>Send DM</li>
            <li>Copy/paste</li>
            <li>Change name</li>
            <li>Repeat 100+ times</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Sound familiar? You're not alone. This mechanical approach to recruiting has become the norm, but it's also the reason why so many talented recruiters are burning out while struggling to hit their numbers.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Hidden Truth About Recruiting</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Here's what most people don't realize: <strong>recruiting is a funnel. Most people just don't treat it like one.</strong></p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">They send messages, hope someone replies, and cross their fingers for a hire. No tracking. No feedback. <strong>Just grind.</strong></p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This approach isn't just inefficient—it's unsustainable. Without understanding your funnel metrics, you're flying blind, working harder instead of smarter, and missing opportunities to optimize what's actually working.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The 100-10-1 Rule Every Recruiter Should Know</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The reality of recruiting comes down to simple math. Most successful recruiters follow what I call the <strong>100-10-1 Rule</strong>:</p>
          <ul className="list-none pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li className="mb-2"><strong>100 profiles viewed</strong></li>
            <li className="mb-2"><strong>10 replies</strong></li>
            <li className="mb-2"><strong>1 hire</strong></li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">This isn't a failure—it's the baseline reality of recruiting. Once you accept these numbers, you can start working with them instead of against them.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Real Math Behind Successful Recruiting</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">To make 3 hires, you'll need:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>300 profiles</li>
            <li>300 messages</li>
            <li>~30 replies</li>
            <li>~9 interviews</li>
            <li>3 offers</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">When you see it laid out like this, the path becomes clear. The question isn't whether you can handle this volume—it's whether you can handle it efficiently.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">What Top Recruiters Do Differently</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Top recruiters don't do more. <strong>They do it smarter.</strong></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="font-outfit text-base font-bold text-gray-800 mb-2">Don't:</p>
              <ul className="list-disc pl-6 font-outfit text-gray-700">
                <li>Click profiles manually</li>
                <li>Rewrite every message</li>
                <li>Pray for replies</li>
              </ul>
            </div>
            <div>
              <p className="font-outfit text-base font-bold text-gray-800 mb-2">Do:</p>
              <ul className="list-disc pl-6 font-outfit text-gray-700">
                <li>Test messaging</li>
                <li>Track replies</li>
                <li>Automate outreach</li>
              </ul>
            </div>
          </div>
          
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The difference isn't in the effort—it's in the system. While average recruiters are stuck in the manual grind, top performers have built processes that scale their efforts and improve their results.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Only Metrics That Matter</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Track this weekly:</p>
          <ul className="list-none pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li className="mb-2"><strong>Messages sent</strong></li>
            <li className="mb-2"><strong>Replies received</strong></li>
            <li className="mb-2"><strong>Reply rate (%)</strong></li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">That's it. You don't need a complex dashboard or expensive analytics tools. These three numbers will tell you everything you need to know about what's working and what isn't.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">When you track these consistently, patterns emerge. You'll see which messages perform better, what days get more responses, and how your reply rates trend over time. This data becomes your competitive advantage.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">What's Actually Slowing You Down</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The real bottleneck isn't talent.</strong></p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The problems holding most recruiters back are:</p>
          <ul className="list-disc pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li>Manual clicking</li>
            <li>LinkedIn limits</li>
            <li>Getting flagged</li>
            <li>No visibility into what's working</li>
            <li>Repeating the same message 200 times</li>
          </ul>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>You don't need more hustle. You need a system.</strong></p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">The Solution Isn't More Messages—It's Better Ones</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">More messages won't save you. <strong>Better ones will.</strong></p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Instead of sending 500 generic messages and hoping for the best, focus on crafting 5-10 high-performing message templates that you can test, refine, and scale. Quality beats quantity every time when you're working within a system.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The most successful recruiters I know have stopped trying to write the perfect message for every candidate. Instead, they've developed a small library of proven messages that they continuously A/B test and improve.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Your Next Steps</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Start treating recruiting like the funnel it actually is:</p>
          <ol className="list-decimal pl-6 font-outfit text-gray-700 text-lg mb-4">
            <li><strong>Set up basic tracking</strong> for messages sent, replies received, and reply rates</li>
            <li><strong>Create 3-5 message templates</strong> instead of writing from scratch every time</li>
            <li><strong>Test one variable at a time</strong>—subject lines, message length, call-to-action</li>
            <li><strong>Review your numbers weekly</strong> and adjust based on what the data tells you</li>
          </ol>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The recruiters who master this approach don't just hit their numbers—they consistently exceed them while working fewer hours and experiencing less burnout.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Remember: recruiting has always been a numbers game. The difference between struggling and succeeding is whether you're playing that game strategically or just hoping for the best.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Ready to Build Your Recruiting System?</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Tiger automates the tracking, testing, and outreach that top recruiters use to scale their results. No more manual clicking, no more guessing what's working, no more LinkedIn limits holding you back.</p>
          <div className="font-outfit text-xl text-center text-[#0A66C2] font-semibold mt-8">
            <a href="https://icptiger.com" className="underline hover:text-[#084b8a]">Try Tiger free for 7 days</a>
          </div>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete Funnel Playbook</h3>
          <p className="font-outfit text-gray-700 mb-4">Want to dive deeper? Get our complete guide to building and optimizing your recruiting funnel for predictable results.</p>
          <a href="/Funnel (HD version).pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <div className="w-full flex justify-center">
            <object
              data="/Funnel (HD version).pdf"
              type="application/pdf"
              className="w-full max-w-2xl h-[600px] rounded-lg shadow-lg"
            >
              <embed
                src="/Funnel (HD version).pdf"
                type="application/pdf"
                className="w-full max-w-2xl h-[600px] rounded-lg shadow-lg"
              />
              <p>Unable to display PDF file. <a href="/Funnel (HD version).pdf" target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] underline">Download</a> instead.</p>
            </object>
          </div>
        </section>
      </>
    ),
  },
  {
    id: 1,
    slug: 'time-drains-killing-recruiting-productivity',
    title: 'The 3 Time Drains Killing Your Recruiting Productivity (And How to Fix Them)',
    summary: 'Stop rewriting the same message 20 times a day. Learn the exact process top recruiters use to cut sourcing time by 60%, create high-converting message templates, and focus on candidates who actually reply.',
    date: '2025-06-25',
    author: 'Adhiraj Hangal',
    seoDescription: 'Learn how top recruiters save time by optimizing their sourcing, messaging, and follow-up processes with Tiger. Discover practical tips for efficient recruitment without compromising quality.',
    content: (
      <>
        <section className="mb-10">
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Most recruiters spend 80% of their week on work that doesn't move the needle. While the average recruiter is buried in administrative tasks and manual processes, top performers have figured out how to save time and get better results.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">The difference isn't about working less or compromising on quality—it's about eliminating the time drains that keep good recruiters stuck in busy work instead of actual recruiting.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Time Drain #1: Manual Sourcing</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The Problem:</strong> Clicking through 100+ profiles daily adds up fast. Most recruiters start from scratch every time they need to find candidates, rebuilding searches and scrolling through the same types of profiles repeatedly.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The Fix:</strong> Build a strong LinkedIn search once—reuse and refine it. Create saved searches for your most common roles, complete with specific filters for location, experience level, and company type. No more guesswork every time you need to source candidates.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">When you nail down the search criteria that consistently produce quality candidates, you can run that same search weekly and focus on the new profiles that match your requirements. This simple shift can cut sourcing time by 60% or more.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Time Drain #2: Rewriting the Same Message</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The Problem:</strong> Sending variations of the same message to 20+ candidates? Most recruiters convince themselves that every message needs to be completely personalized, so they spend 5-10 minutes crafting each outreach message from scratch.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The Fix:</strong> Write one clean, targeted message per role. Make it short, relevant, and easy to reply to. The truth is, candidates care more about the opportunity being relevant than about hyper-personalization.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Create 3-5 message templates for each role you recruit for regularly. Include the key details that matter—role, company, and what makes this opportunity different. You can still personalize the opening line, but the core message stays consistent and proven.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Time Drain #3: Chasing the Wrong Candidates</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The Problem:</strong> Title matches ≠ good fit. Too many recruiters see "Software Engineer" in someone's title and immediately add them to their outreach list, without considering whether they're actually a viable candidate.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4"><strong>The Fix:</strong> Filter for company size, stage, and recent activity. Only message people likely to respond. Look for candidates at companies similar to your client, with recent job changes or activity that suggests they might be open to new opportunities.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">A developer at a 10-person startup probably isn't interested in a corporate role at a 10,000-person company, and vice versa. Spending 30 seconds qualifying each profile before adding them to your outreach list saves hours of wasted time later.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-recoleta text-3xl font-bold mb-4 text-[#0A66C2]">Ready to Transform Your Recruiting?</h2>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">These time-saving strategies will help you recruit more efficiently. But the real breakthrough happens when you combine smarter processes with reliable automation.</p>
          <p className="font-outfit text-lg text-gray-700 text-lg mb-4">Tiger automates the tracking, testing, and outreach that top recruiters use to scale their results. No more manual clicking, no more guessing what's working, no more LinkedIn limits holding you back.</p>
          <div className="font-outfit text-xl text-center text-[#0A66C2] font-semibold mt-8">
            <a href="/sign-up" className="underline hover:text-[#084b8a]">Try Tiger free for 7 days</a>
          </div>
        </section>

        <section className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h3 className="font-recoleta text-xl font-bold mb-4 text-gray-900">Download the Complete Time-Saving Guide</h3>
          <p className="font-outfit text-gray-700 mb-4">Want to dive deeper? Get our complete guide to saving 10+ hours every week while improving your recruiting results.</p>
          <a href="/top-recruiters-saving-10-hours.pdf" className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-outfit hover:bg-[#084c8e] transition-colors">Download PDF Guide</a>
        </section>

        <section className="mt-16 mb-10">
          <div className="w-full flex justify-center">
            <object
              data="/top-recruiters-saving-10-hours.pdf"
              type="application/pdf"
              className="w-full max-w-2xl h-[600px] rounded-lg shadow-lg"
            >
              <embed
                src="/top-recruiters-saving-10-hours.pdf"
                type="application/pdf"
                className="w-full max-w-2xl h-[600px] rounded-lg shadow-lg"
              />
              <p>Unable to display PDF file. <a href="/top-recruiters-saving-10-hours.pdf" target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] underline">Download</a> instead.</p>
            </object>
          </div>
        </section>
      </>
    ),
  },
];