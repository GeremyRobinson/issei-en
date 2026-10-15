import { useEffect } from "react";
import "./Terms.css";

/** Terms, Privacy, Purchase and Cookie policies, one per column, as on the current site. */
export default function Terms() {
  useEffect(() => {
    document.title = "Terms — ISSEI—EN";
  }, []);
  return (
    <section className="terms grid">
      <article>
        <div className="half">
          <h1>Terms of Use</h1>
          <p>Updated: 09/18/2026</p>
        </div>
        <div className="blank" />
        <p>By using the ISSEI-EN website ("Site"), you agree to these Terms. If you do not agree, do not use the Site.</p>
        <p>
          Acceptance and Use: The Site provides information about ISSEI LLC and its products and, for approved trade accounts, a
          means of placing wholesale orders. Purchases are governed by the Purchase Policy.
        </p>
        <p>
          User Conduct: You agree not to use the Site for any illegal purpose, disrupt its operations, attempt unauthorized access,
          or upload harmful code.
        </p>
        <p>
          Intellectual Property: All Site content, including text, graphics, and logos, is owned by ISSEI LLC or its licensors and
          protected by copyright and trademark law. You may view and download content for personal, non-commercial use only.
        </p>
        <p>
          Disclaimer and Liability: THE SITE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY
          LAW, ISSEI LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL, CONSEQUENTIAL, OR INCIDENTAL DAMAGES ARISING FROM YOUR USE OF
          THE SITE.
        </p>
        <p>
          Legal: These Terms are governed by the laws of the State of California. Continued use of the Site after any updates
          constitutes acceptance of the updated Terms.
        </p>
      </article>

      <article>
        <h2>Privacy Policy</h2>
        <div className="blank" />
        <p>Information Collected: We collect three types of data:</p>
        <ol>
          <li>Information you provide: Data submitted via forms (e.g., name, email).</li>
          <li>Automatic data: Information collected via cookies and analytics tools (e.g., IP address, browser type).</li>
          <li>Usage data: Records of how you interact with the Site (e.g., pages viewed).</li>
        </ol>
        <p>
          How We Use Your Data: We use your information to operate and improve the Site, respond to your inquiries, send
          informational updates (with opt-out), and comply with legal requirements.
        </p>
        <p>
          Sharing Data: We do not sell your personal data. We may share data only with service providers under confidentiality
          agreements, legal authorities when required, or in connection with a business transfer.
        </p>
        <p>Your Rights: You have the right to:</p>
        <ul>
          <li>Opt out of marketing emails via unsubscribe links.</li>
          <li>Request access, correction, or deletion of your data by contacting us.</li>
          <li>Disable cookies through your browser settings.</li>
        </ul>
        <p>
          Data Security &amp; Limitations: We implement reasonable security measures, but no system is entirely secure. This Site is
          not intended for children under 13. Data may be processed in the United States.
        </p>
      </article>

      <article>
        <h2>Purchase Policy</h2>
        <div className="blank" />
        <p>
          Wholesale Only: ISSEI LLC sells to businesses purchasing for resale. Orders are not binding until confirmed by us in
          writing.
        </p>
        <p>
          Pricing: Prices are those on our wholesale price list in effect when your order is confirmed, exclusive of shipping and
          tax.
        </p>
        <p>
          Price Changes: We may revise our price list on sixty (60) days' written notice. New prices apply only to orders confirmed
          on or after the effective date.
        </p>
        <p>
          Payment: Orders are payable before shipment unless we extend written credit terms, in which case invoices are net
          fourteen (14) days.
        </p>
        <p>
          Shipping and Risk of Loss: All shipments are FOB Origin. Title and risk of loss pass to you when products are delivered to
          the carrier. ISSEI LLC is not responsible for packages lost, stolen, delayed, misdelivered, or damaged in transit, or
          delivered to an incorrect address you supplied. We will assist with a carrier claim as a courtesy. We ship within the
          United States only.
        </p>
        <p>
          Returns: Products are food items and are sold final sale. Shortages, incorrect items, and transit damage must be reported
          within five (5) business days of delivery with photographs.
        </p>
        <p>
          Liability: OUR TOTAL LIABILITY ON ANY ORDER SHALL NOT EXCEED THE AMOUNT PAID FOR THE PRODUCTS GIVING RISE TO THE CLAIM.
        </p>
      </article>

      <article>
        <h2>Cookie Policy</h2>
        <div className="blank" />
        <p>What Are Cookies? Cookies are small files placed on your device to collect standard internet activity and visitor behavior.</p>
        <p>Types of Cookies Used:</p>
        <ul>
          <li>Essential Cookies: Necessary for the core function of the Site (e.g., navigation).</li>
          <li>Analytics Cookies: Used to help us understand how the Site is used (e.g., tracking usage).</li>
          <li>Functional Cookies: Used to remember your preferences.</li>
        </ul>
        <p>
          Management: You can manage or disable cookies using your browser settings. Note that disabling cookies may prevent certain
          features of the Site from working correctly.
        </p>
      </article>

      <article>
        <h2>Contact Information</h2>
        <div className="blank" />
        <p>
          For general inquiries, please use{" "}
          <a className="u" href="mailto:info@issei-en.com">
            info@issei-en.com
          </a>
          . For sales inquiries, please use{" "}
          <a className="u" href="mailto:sales@issei-en.com">
            sales@issei-en.com
          </a>
          . For legal notices or data requests, please use{" "}
          <a className="u" href="mailto:legal@issei-en.com">
            legal@issei-en.com
          </a>
          .
        </p>
      </article>
    </section>
  );
}
