import Header from "@/app/(home)/header";
import Footer from "@/app/(home)/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="font-rufina text-4xl md:text-5xl lg:text-6xl font-black text-black">
                Privacy Policy
              </h1>
              <p className="font-outfit text-lg text-black/70">Last Updated: January 22, 2025</p>
            </div>

            <div className="space-y-12">
              <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Welcome to ICP Tiger</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  At ICP Tiger, a product of Adhio LLC ("we," "us," or "our"), we operate icptiger.com and provide AI-powered LinkedIn automation services. This Privacy Policy explains how we handle your information when you use our service. By using ICP Tiger, you acknowledge that all services, transactions, and agreements are legally operated by Adhio LLC, and you agree to the practices described in this policy.
                </p>
                </section>

              <section className="space-y-6">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">What Information We Work With</h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">Essential Information</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">Your email address for account creation</li>
                      <li className="list-disc">Basic profile details you choose to share</li>
                      <li className="list-disc">Payment information if you subscribe to our premium features (processed securely through our payment partners)</li>
                      </ul>
                    </div>
                    
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">Service Usage Information</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">How you interact with our automation tools</li>
                      <li className="list-disc">Connection requests and messaging patterns</li>
                      <li className="list-disc">Features you use most frequently</li>
                      </ul>
                    </div>
                    
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">LinkedIn Integration Data</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">LinkedIn profile information you authorize us to access</li>
                      <li className="list-disc">Connection and messaging data for automation purposes</li>
                      <li className="list-disc">Campaign performance and analytics</li>
                      </ul>
                    </div>
                  </div>
                </section>

              <section className="space-y-6">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">How We Use Your Information</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                    We're committed to using your information responsibly and only for specific purposes:
                  </p>
                  
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">Improving Your Experience</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">Optimizing automation campaigns for better results</li>
                      <li className="list-disc">Personalizing outreach strategies to match your goals</li>
                      <li className="list-disc">Making our service more intuitive and efficient</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">Essential Operations</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">Processing your subscription payments securely</li>
                      <li className="list-disc">Sending important updates about our service</li>
                      <li className="list-disc">Maintaining the security of your account</li>
                    </ul>
                  </div>
                  </div>
                </section>

              <section className="space-y-6">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Information Sharing</h2>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">Our Promise</h3>
                    <p className="font-outfit text-lg text-black/70 leading-relaxed">We never sell your personal information. Period.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">Limited Sharing</h3>
                    <p className="font-outfit text-lg text-black/70 leading-relaxed">We may share information in these situations:</p>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">With service providers who help operate our service</li>
                      <li className="list-disc">When required by law</li>
                      <li className="list-disc">With your explicit consent</li>
                    </ul>
                  </div>
                  </div>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Keeping Your Information Safe</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">Security is a top priority at ICP Tiger. We protect your information using:</p>
                <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                  <li className="list-disc">Enterprise-grade encryption for all data</li>
                  <li className="list-disc">Regular security updates and monitoring</li>
                  <li className="list-disc">Strict access controls for our team</li>
                  <li className="list-disc">Continuous system testing and verification</li>
                  </ul>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">How Long We Keep Your Information</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">We keep your information only as long as needed:</p>
                <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                  <li className="list-disc">Account details remain while your account is active</li>
                  <li className="list-disc">Campaign history stays available in your account</li>
                  <li className="list-disc">Basic usage data helps us improve our service</li>
                  </ul>
                <p className="font-outfit text-lg text-black/70 leading-relaxed mt-4">
                    You can request deletion of your information at any time through your account settings.
                  </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Managing Your Information</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">You can manage your account information through your ICP Tiger settings:</p>
                <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                  <li className="list-disc">Update your basic profile information</li>
                  <li className="list-disc">Modify your communication preferences</li>
                  <li className="list-disc">Request account closure if needed</li>
                  <li className="list-disc">Contact our support team with specific data-related questions</li>
                  </ul>
                <p className="font-outfit text-lg text-black/70 leading-relaxed mt-4">
                    We'll respond to data-related requests in accordance with applicable laws and our technical capabilities.
                  </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Cookies & Similar Technologies</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">To make ICP Tiger work smoothly, we use cookies and similar technologies for:</p>
                <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                  <li className="list-disc">Keeping you logged in securely</li>
                  <li className="list-disc">Remembering your preferences</li>
                  <li className="list-disc">Understanding how we can improve</li>
                  <li className="list-disc">Making our service faster and more reliable</li>
                  </ul>
                <p className="font-outfit text-lg text-black/70 leading-relaxed mt-4">
                    You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">International Data Transfers</h2>
                <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                  <li className="list-disc">Data may be processed in different countries</li>
                  <li className="list-disc">We ensure appropriate safeguards for international transfers</li>
                  </ul>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Contact Information</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  For privacy-related questions or concerns, contact us at: info@icptiger.com
                  </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Changes to Privacy Policy</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                    We may update this Privacy Policy periodically. Users will be notified of significant changes.
                  </p>
                </section>
              </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
