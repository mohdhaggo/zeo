import React from 'react';
import { LegalPage, Section, P, List, LI } from '../../components/legal/LegalPage';
import { COMPANY } from '../../config/company';

/**
 * Terms and conditions.
 *
 * The footer has linked to /terms-conditions since before this page existed,
 * so that path is kept rather than renamed - the old link now resolves instead
 * of falling through to the 404 route.
 */
export const TermsPage: React.FC = () => (
  <LegalPage
    title="Terms & Conditions"
    intro={'The terms on which ' + COMPANY.brand + ' makes this website, its warranty service and its products available to you.'}
  >
    <Section heading="1. These terms">
      <P>
        This website is operated by {COMPANY.legalName} (registration number{' '}
        {COMPANY.registrationNumber}), registered in {COMPANY.country} at {COMPANY.address}, trading
        as {COMPANY.brand}. In these terms, "we" and "us" mean that company, and "you" means anyone
        using this site.
      </P>
      <P>
        By using the site you accept these terms. If you do not accept them, please stop using the
        site. We may update these terms, and the date at the top of this page shows when we last
        did.
      </P>
    </Section>

    <Section heading="2. What this site is for">
      <P>
        This site presents our range of paint protection film, window tint and windshield film, and
        lets you contact us about distribution, pricing and technical support. It also lets a
        warranty holder check and register a warranty.
      </P>
      <P>
        Nothing on this site is an offer to sell. Product descriptions, specifications and
        indicative prices are an invitation for you to enquire. A contract exists only when we
        confirm an order to you in writing.
      </P>
    </Section>

    <Section heading="3. Using the site properly">
      <P>You agree not to:</P>
      <List>
        <LI>
          Submit false information, register a warranty you do not hold, or claim a warranty number
          that is not yours.
        </LI>
        <LI>
          Use automated tools to submit forms, scrape content, or test warranty numbers in bulk.
        </LI>
        <LI>
          Attempt to gain access to any part of the site, server or database you are not authorised
          to reach.
        </LI>
        <LI>
          Interfere with the site, introduce malicious code, or place a load on it designed to
          disrupt it.
        </LI>
        <LI>Use the site for anything unlawful, or in breach of any regulation that applies to you.</LI>
      </List>
      <P>
        We may suspend or refuse access if we reasonably believe you have breached this section.
      </P>
    </Section>

    <Section heading="4. Product information and claims">
      <P>
        We describe our products as accurately as we can. Performance figures, warranty durations
        and material properties are stated on the basis of manufacturer testing under controlled
        conditions.
      </P>
      <P>
        Real-world results vary with the vehicle, the surface, the quality of the installation, the
        climate and how the vehicle is maintained. Figures on this site are indicative and are not a
        guarantee that any particular result will be achieved on your vehicle. Colours shown on
        screen are approximate.
      </P>
    </Section>

    <Section heading="5. Warranty">
      <P>
        Each product carries the warranty stated for it. The warranty covers the film against the
        defects described in the warranty documentation supplied with the product, for the period
        stated, from the date of professional installation.
      </P>
      <P>The warranty does not cover:</P>
      <List>
        <LI>Damage from impact, accident, misuse, abrasive cleaning or chemical attack.</LI>
        <LI>
          Film that was not installed by an installer we have approved, or that was removed and
          refitted.
        </LI>
        <LI>Damage to paint or glass that was already present before installation.</LI>
        <LI>Normal wear, or gradual change in appearance over the life of the film.</LI>
      </List>
      <P>
        A warranty must be registered before a claim can be made. Registration is a one-time action
        tied to the warranty number, and a number that has already been registered cannot be
        registered again. To make a claim, contact us at{' '}
        <a href={'mailto:' + COMPANY.contactEmail} style={{ color: '#FF6B6B' }}>
          {COMPANY.contactEmail}
        </a>{' '}
        with the warranty number and photographs of the problem.
      </P>
      <P>
        Where a claim succeeds, our obligation is limited to supplying replacement film for the
        affected area, or refunding the price of the film. Installation labour is a matter between
        you and your installer unless we have agreed otherwise in writing.
      </P>
    </Section>

    <Section heading="6. Orders, pricing and distribution">
      <P>
        Where we agree to supply products, the commercial terms of that supply are set out in the
        order confirmation or distribution agreement between us. Those terms take precedence over
        this page if the two disagree.
      </P>
      <P>
        Prices quoted are exclusive of tax, duty and shipping unless stated otherwise. We may change
        prices for future orders at any time. Where an order involves payment, our{' '}
        <a href="/refund-policy" style={{ color: '#FF6B6B' }}>
          refund policy
        </a>{' '}
        applies and forms part of these terms.
      </P>
    </Section>

    <Section heading="7. Our content">
      <P>
        The text, images, video, product renders, logos and branding on this site belong to us or to
        our licensors, and are protected by copyright and trade mark law. You may view and print
        pages for your own reference or to evaluate our products.
      </P>
      <P>
        You may not copy, republish, sell or use any of it commercially, or use our name or logo,
        without our written permission. Approved distributors are given separate marketing materials
        and a licence to use them.
      </P>
    </Section>

    <Section heading="8. Third-party links and services">
      <P>
        This site uses services provided by others, including hosting, email delivery, anti-spam
        checking and analytics. Where we link to another website we do not control it and are not
        responsible for its content or its handling of your information.
      </P>
    </Section>

    <Section heading="9. Availability">
      <P>
        We try to keep the site available, but we do not promise it will be uninterrupted or free of
        error. We may suspend, withdraw or change any part of it without notice. We are not liable
        to you if the site is unavailable at any time.
      </P>
    </Section>

    <Section heading="10. Our liability">
      <P>
        Nothing in these terms limits our liability for death or personal injury caused by our
        negligence, for fraud, or for anything else that the law does not allow us to limit.
      </P>
      <P>
        Subject to that, we are not liable for loss of profit, loss of business, loss of goodwill or
        any indirect or consequential loss arising from your use of this site. Our total liability
        in connection with the site and any product supplied through it is limited to the amount you
        paid us for the product concerned.
      </P>
      <P>
        Nothing here affects rights the law gives you as a consumer that cannot be excluded by
        agreement.
      </P>
    </Section>

    <Section heading="11. Privacy">
      <P>
        How we handle personal information is set out in our{' '}
        <a href="/privacy-policy" style={{ color: '#FF6B6B' }}>
          privacy policy
        </a>
        , which forms part of these terms.
      </P>
    </Section>

    <Section heading="12. Governing law">
      <P>
        These terms, and any dispute arising out of them or out of your use of this site, are
        governed by {COMPANY.governingLaw}. Disputes are subject to the exclusive jurisdiction of{' '}
        {COMPANY.courts}.
      </P>
    </Section>

    <Section heading="13. Contact">
      <P>
        Questions about these terms go to{' '}
        <a href={'mailto:' + COMPANY.contactEmail} style={{ color: '#FF6B6B' }}>
          {COMPANY.contactEmail}
        </a>
        .
      </P>
    </Section>
  </LegalPage>
);
