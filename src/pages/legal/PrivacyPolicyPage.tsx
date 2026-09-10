import React from 'react';
import { LegalPage, Section, P, List, LI } from '../../components/legal/LegalPage';
import { COMPANY } from '../../config/company';

/**
 * Privacy policy.
 *
 * Written against what the code actually does rather than from a template.
 * Every field named here is a field the site really collects (see
 * functions/api/contact.ts and functions/api/warranty/register.ts), and every
 * recipient named is a service the site really sends data to. If a form field
 * or a third party changes, this page has to change with it.
 *
 * The company is registered in China, so China's Personal Information
 * Protection Law sets the baseline. Every processor the site uses sits outside
 * China, which is why the cross-border section is unusually prominent - under
 * PIPL that transfer needs its own notice and its own consent, separate from
 * general consent to the policy.
 */
export const PrivacyPolicyPage: React.FC = () => (
  <LegalPage
    title="Privacy Policy"
    intro={'How ' + COMPANY.brand + ' collects, uses, stores and shares personal information, and the choices you have.'}
  >
    <Section heading="1. Who we are">
      <P>
        This site is operated by {COMPANY.legalName} (registration number{' '}
        {COMPANY.registrationNumber}), registered in {COMPANY.country} at {COMPANY.address}, trading
        as {COMPANY.brand}. We are the party that decides why and how your personal information is
        handled.
      </P>
      <P>
        For any privacy question, or to exercise any right described below, write to{' '}
        <a href={'mailto:' + COMPANY.privacyEmail} style={{ color: '#FF6B6B' }}>
          {COMPANY.privacyEmail}
        </a>
        .
      </P>
    </Section>

    <Section heading="2. What we collect">
      <P>We collect only what a form asks for. There are two forms on this site.</P>
      <P>
        <strong style={{ color: '#FFFFFF' }}>The contact form</strong> collects your name, email
        address, phone number, your region, the product you are interested in, and your message.
      </P>
      <P>
        <strong style={{ color: '#FFFFFF' }}>Warranty registration</strong> collects the warranty
        number, the name of the warranty holder, an email address, a phone number, the country of
        purchase and the date of purchase.
      </P>
      <P>
        We also receive information automatically when you visit, whether or not you fill anything
        in:
      </P>
      <List>
        <LI>
          Your IP address, browser and device type, and the pages you request. This is standard
          web-server information, and your IP address is also sent to Google as part of the
          anti-spam check on the contact form.
        </LI>
        <LI>Aggregate visit statistics from our analytics, described in section 6.</LI>
      </List>
      <P>
        We do not ask for and do not want payment card details, government identification numbers,
        biometric data, health data, religious belief, or location tracking. Please do not put
        information of that kind into the message box.
      </P>
    </Section>

    <Section heading="3. Why we use it, and on what basis">
      <List>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>To answer you.</strong> Contact form details are used
          to reply to your enquiry and to follow up about distribution, pricing or technical
          support. Basis: your consent, given when you submit the form.
        </LI>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>To operate the warranty.</strong> Registration
          details are used to record who a warranty belongs to and to assess claims against it.
          Basis: performing the warranty we owe you.
        </LI>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>To keep the site working.</strong> Server records and
          the anti-spam check protect the site from abuse. Basis: our legitimate interest in a site
          that is not overwhelmed by automated submissions.
        </LI>
      </List>
      <P>
        We do not sell personal information. We do not use it for automated decision-making that
        produces a legal or similarly significant effect on you, and we do not build advertising
        profiles.
      </P>
    </Section>

    <Section heading="4. Who else sees it">
      <P>
        We use a small number of service providers, and each one only handles what its job requires:
      </P>
      <List>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>Cloudflare, Inc. (United States)</strong> hosts this
          site and stores our database. Everything you submit is stored on Cloudflare
          infrastructure.
        </LI>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>Resend (United States)</strong> delivers the
          notification email that carries your enquiry to us.
        </LI>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>Google LLC (United States)</strong> provides the
          reCAPTCHA anti-spam check, which receives your IP address and interaction signals, the web
          fonts the site displays, and our website analytics.
        </LI>
      </List>
      <P>
        Beyond these, we disclose personal information only where the law compels us to, or to
        establish or defend a legal claim. We do not share it with advertisers or data brokers.
      </P>
    </Section>

    <Section heading="5. Transfers outside China">
      <P>
        This matters, so it is stated plainly. Every provider named in section 4 is located outside
        the People's Republic of China, and the personal information you submit is therefore stored
        and processed abroad, principally in the United States.
      </P>
      <P>
        By submitting a form on this site you are giving your separate consent to that transfer. The
        recipients, the categories of information and the purposes are exactly those set out in
        sections 2, 3 and 4. Each recipient is bound by its contract with us to protect the
        information to the standard this policy describes, and to use it only for the purpose we
        gave it.
      </P>
      <P>
        If you would rather your information were not transferred outside China, do not use the
        forms. Email us instead and we will handle your enquiry that way.
      </P>
    </Section>

    <Section heading="6. Cookies and analytics">
      <P>
        The site itself sets no cookie in order to work. Three measurement or protection tools are
        in use, and they are not treated the same way:
      </P>
      <List>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>Cloudflare Web Analytics</strong> counts visits
          without setting any cookie and without following you between sites. It runs on every
          visit.
        </LI>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>Google Analytics</strong> does set cookies. It stays
          switched off until you accept it through the banner shown on your first visit, and if you
          decline it is never loaded at all. You can change your mind at any time using the cookie
          settings link in the footer.
        </LI>
        <LI>
          <strong style={{ color: '#FFFFFF' }}>Google reCAPTCHA</strong> may set cookies in your
          browser as part of deciding whether a submission is automated. It runs on the contact page
          because without it the form would be swamped by automated submissions.
        </LI>
      </List>
    </Section>

    <Section heading="7. How long we keep it">
      <List>
        <LI>Contact enquiries: kept for 24 months from your last contact with us, then deleted.</LI>
        <LI>
          Warranty registrations: kept for the life of the warranty plus 12 months, because we
          cannot honour a claim against a record we have deleted.
        </LI>
        <LI>Server and analytics records: kept in aggregate only, and not tied back to you.</LI>
      </List>
      <P>You can ask us to delete your information sooner. See section 8.</P>
    </Section>

    <Section heading="8. Your rights">
      <P>You can ask us to do any of the following, and we will not charge you for it:</P>
      <List>
        <LI>Tell you what we hold about you, and give you a copy.</LI>
        <LI>Correct anything that is wrong or out of date.</LI>
        <LI>
          Delete what we hold, unless we are required to keep it to honour a warranty or to meet a
          legal obligation.
        </LI>
        <LI>Restrict how we use it, or object to a particular use.</LI>
        <LI>
          Withdraw your consent. This stops any future use but does not undo what was lawfully done
          before you withdrew.
        </LI>
        <LI>Receive your information in a portable form, or have it transferred elsewhere.</LI>
      </List>
      <P>
        Write to{' '}
        <a href={'mailto:' + COMPANY.privacyEmail} style={{ color: '#FF6B6B' }}>
          {COMPANY.privacyEmail}
        </a>{' '}
        and we will respond within 30 days. We may ask you to confirm your identity first, so that
        we are not handing your information to somebody else.
      </P>
      <P>
        If you are unhappy with our response you can complain to the data protection authority where
        you live. Visitors in the European Economic Area, the United Kingdom, the United Arab
        Emirates and Saudi Arabia have rights under their own local laws that sit alongside those
        above, and we honour them.
      </P>
    </Section>

    <Section heading="9. Children">
      <P>
        This site is for businesses and vehicle owners and is not directed at children. We do not
        knowingly collect information from anyone under 14. If you believe a child has submitted
        information to us, tell us and we will delete it.
      </P>
    </Section>

    <Section heading="10. Security">
      <P>
        Traffic to this site is encrypted in transit. Access to the database is limited to our
        server code and to a small number of named administrator accounts protected by individual
        passwords, which are stored only as salted hashes. The public warranty lookup deliberately
        returns only the product, the dates and the status, never the holder's name, phone number or
        email address.
      </P>
      <P>
        No system is perfect. If a breach occurs that puts you at risk, we will notify you and the
        relevant authority as the law requires.
      </P>
    </Section>

    <Section heading="11. Changes">
      <P>
        If we change this policy we will update the date at the top of the page. If the change is
        significant, for example a new recipient of your information or a new purpose, we will ask
        for your consent again rather than relying on the old one.
      </P>
    </Section>
  </LegalPage>
);
