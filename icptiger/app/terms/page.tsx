import Header from "@/app/(home)/header";
import Footer from "@/app/(home)/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="font-rufina text-4xl md:text-5xl lg:text-6xl font-black text-black">
                Terms of Service
              </h1>
              <p className="font-outfit text-lg text-black/70">Last Updated: January 22, 2025</p>
            </div>

            <div className="space-y-12">
                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">1. Introduction</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  Welcome to ICP Tiger, a product of Adhio LLC ("we," "our," or "us"). By accessing or using our LinkedIn automation service (the "Service"), you acknowledge that ICP Tiger is operated by Adhio LLC and agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using the Service.
                </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">2. Service Description</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  ICP Tiger helps professionals automate their LinkedIn outreach to connect with decision makers, potential customers, partners, and investors. Our platform provides safe, effective, and affordable LinkedIn automation tools.
                  </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">3. Account Registration</h2>
                <div className="font-outfit text-lg text-black/70 leading-relaxed space-y-3">
                    <p>3.1. To use our Service, you must create an account with accurate, complete, and current information.</p>
                    <p>3.2. You are responsible for maintaining the confidentiality of your account credentials.</p>
                  <p>3.3. You must be at least 18 years old to use our Service.</p>
                  </div>
                </section>

              <section className="space-y-6">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">4. Subscription Plans and Payment</h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">4.1. Free Plan:</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">Limited access to basic automation features</li>
                      <li className="list-disc">Subject to usage caps and restrictions</li>
                      <li className="list-disc">Connect with up to 500 decision makers per month</li>
                      </ul>
                    </div>
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">4.2. Premium Plan:</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">Enhanced automation features and capabilities</li>
                      <li className="list-disc">Higher connection limits and advanced targeting</li>
                      <li className="list-disc">Priority support and advanced analytics</li>
                      <li className="list-disc">Recurring subscription billing</li>
                      <li className="list-disc">Cancellation available through account settings</li>
                      </ul>
                    </div>
                  </div>
                </section>

              <section className="space-y-6">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">5. Fair Use Policy</h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">5.1. LinkedIn Automation:</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">Our service is designed for professionals building meaningful business relationships</li>
                      <li className="list-disc">Automation should be used to enhance, not replace, genuine networking efforts</li>
                      <li className="list-disc">Users must comply with LinkedIn's terms of service and community guidelines</li>
                      <li className="list-disc">Spam or mass messaging to unrelated contacts is prohibited</li>
                      </ul>
                    </div>
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">5.2. Connection Requests:</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">Target relevant professionals within your industry or interests</li>
                      <li className="list-disc">Personalize connection requests when possible</li>
                      <li className="list-disc">Respect LinkedIn's daily and weekly limits</li>
                      <li className="list-disc">Monitor and adjust campaigns based on acceptance rates</li>
                      </ul>
                    </div>
                  </div>
                </section>

              <section className="space-y-6">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">6. Intellectual Property Rights</h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">6.1. User Content:</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">You retain ownership of your original content and messaging templates</li>
                      <li className="list-disc">You grant us a license to process and deliver your automation campaigns</li>
                      </ul>
                    </div>
                  <div className="space-y-3">
                    <h3 className="font-rufina text-xl font-semibold text-black">6.2. Service Content:</h3>
                    <ul className="font-outfit text-lg text-black/70 space-y-2 pl-6">
                      <li className="list-disc">ICP Tiger platform, features, and technology remain our intellectual property</li>
                      <li className="list-disc">Users receive a limited license to use the Service during their subscription</li>
                      <li className="list-disc">Reverse engineering or copying our automation technology is prohibited</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">7. Prohibited Uses</h2>
                <div className="font-outfit text-lg text-black/70 leading-relaxed">
                  <p className="mb-4">Users may not:</p>
                  <ul className="space-y-2 pl-6">
                    <li className="list-disc">Generate spam or misleading content</li>
                    <li className="list-disc">Attempt to reverse engineer the Service</li>
                    <li className="list-disc">Use the Service for illegal or harmful purposes</li>
                    <li className="list-disc">Share account access with unauthorized users</li>
                    <li className="list-disc">Violate LinkedIn's terms of service or community guidelines</li>
                    <li className="list-disc">Use the Service to harass or send unsolicited commercial messages</li>
                    <li className="list-disc">Attempt to circumvent usage limits or restrictions</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">8. Account Suspension and Termination</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  We reserve the right to suspend, limit, or terminate accounts at our sole discretion for any reason, including if you violate these Terms, our Fair Use Policy, or LinkedIn's terms of service. We may also suspend accounts if we detect unusual activity that could risk your LinkedIn account safety.
                  </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">9. Refund Policy</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  No refunds or credits will be provided. All sales are final. Subscriptions can be cancelled at any time to prevent future charges, but no refunds will be issued for unused portions of the current billing period.
                  </p>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">10. Disclaimers and Limitations</h2>
                <div className="font-outfit text-lg text-black/70 leading-relaxed space-y-3">
                  <p>10.1. The Service is provided "as is" without warranties of any kind</p>
                  <p>10.2. We are not responsible for LinkedIn account restrictions or suspensions</p>
                  <p>10.3. We may modify or discontinue features without notice</p>
                  <p>10.4. Results may vary and are not guaranteed</p>
                  <p>10.5. Users are responsible for compliance with all applicable laws and LinkedIn policies</p>
                  </div>
                </section>

                <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">11. Contact Information</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  For questions about these Terms, contact us at: info@icptiger.com
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-rufina text-2xl md:text-3xl font-bold text-black">Changes to Terms</h2>
                <p className="font-outfit text-lg text-black/70 leading-relaxed">
                  These Terms may be updated from time to time. The current version will be available at icptiger.com. Your continued use of ICP Tiger means you accept any updates to these Terms.
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
