import React from 'react';
import { LegalPage, Section, P, List, LI } from '../../components/legal/LegalPage';
import { COMPANY } from '../../config/company';

/**
 * Refund and returns policy.
 *
 * The site takes no payment today - it collects enquiries and warranty
 * registrations only. This page is written for the online ordering that is
 * planned, and says so openly rather than implying a checkout exists. When
 * ordering goes live, the parts about how a refund is issued are already
 * correct; only the payment-method wording will need a second look.
 */
export const RefundPolicyPage: React.FC = () => (
  <LegalPage
    title="Refund & Returns Policy"
    intro={'When ' + COMPANY.brand + ' will refund or replace a product, how to ask, and how long it takes.'}
  >
    <Section heading="1. Where this applies">
      <P>
        This site does not take payment today. Orders are placed through our sales team or through
        an approved distributor, and online ordering is planned. This policy covers any product
        supplied by {COMPANY.legalName}, however the order was placed, and it will apply to online
        orders from the day that facility opens.
      </P>
      <P>
        If you bought from an approved distributor rather than from us directly, ask them first.
        Their returns process applies to your purchase, and this policy sets the minimum they must
        offer you.
      </P>
    </Section>

    <Section heading="2. Cancelling before dispatch">
      <P>
        You may cancel any order at no cost before it is dispatched. Email{' '}
        <a href={'mailto:' + COMPANY.contactEmail} style={{ color: '#FF6B6B' }}>
          {COMPANY.contactEmail}
        </a>{' '}
        with your order reference. If payment has already been taken, we refund it in full.
      </P>
      <P>
        Film cut to a size or pattern specific to your vehicle is made to order. Once cutting has
        started it cannot be cancelled, and we will tell you when that point is reached.
      </P>
    </Section>

    <Section heading="3. Returning an unused product">
      <P>
        You may return an unopened, uninstalled product in its original packaging within 14 days of
        receiving it, for a refund of the price you paid.
      </P>
      <List>
        <LI>The roll must be unopened and the packaging seal intact.</LI>
        <LI>You pay the cost of returning it, unless the return is because of our error.</LI>
        <LI>
          We refund within 14 days of receiving the product back and confirming its condition.
        </LI>
      </List>
      <P>
        Film that has been unrolled, cut, partially applied or installed cannot be returned under
        this section, because it cannot be resold. If there is a fault with it, section 4 applies
        instead.
      </P>
    </Section>

    <Section heading="4. Faulty, damaged or wrong products">
      <P>
        If a product arrives damaged, is not what you ordered, or has a manufacturing defect, tell
        us within 7 days of delivery and we will put it right at no cost to you. Send photographs of
        the product and the packaging with your message.
      </P>
      <P>You choose between:</P>
      <List>
        <LI>A replacement, shipped at our cost.</LI>
        <LI>A full refund, including what you originally paid for delivery.</LI>
      </List>
      <P>
        Where a defect appears after installation, it is handled as a warranty claim under our{' '}
        <a href="/terms-conditions" style={{ color: '#FF6B6B' }}>
          terms and conditions
        </a>{' '}
        rather than as a return, and the remedy there is replacement film or a refund of the price
        of the film.
      </P>
    </Section>

    <Section heading="5. What is not refundable">
      <List>
        <LI>Film that has been installed, other than under a valid warranty claim.</LI>
        <LI>Custom-cut film, once cutting has begun.</LI>
        <LI>
          Damage caused by incorrect installation, incorrect storage, accident, misuse or abrasive
          or chemical cleaning.
        </LI>
        <LI>Installation labour charged by a third-party installer.</LI>
        <LI>
          Products bought from a seller we have not approved. We cannot verify that such a product
          is genuine.
        </LI>
      </List>
    </Section>

    <Section heading="6. How a refund is paid">
      <P>
        Refunds go back to the original payment method. We do not issue a refund to a different
        account or a different person from the one that paid.
      </P>
      <P>
        We process refunds within 14 days of approving them. How quickly the money appears after
        that is up to your bank or card issuer, and usually takes a further 5 to 10 working days.
        Bank charges on an international transfer are deducted from the amount received where your
        bank imposes them.
      </P>
    </Section>

    <Section heading="7. How to ask">
      <P>
        Email{' '}
        <a href={'mailto:' + COMPANY.contactEmail} style={{ color: '#FF6B6B' }}>
          {COMPANY.contactEmail}
        </a>{' '}
        with your order reference, what you bought, what is wrong, and photographs where the product
        is faulty or damaged. We reply within 3 working days and tell you what happens next.
      </P>
      <P>Do not send anything back before we have confirmed the return, or we may not be able to trace it.</P>
    </Section>

    <Section heading="8. Your legal rights">
      <P>
        This policy sits on top of the rights the law gives you, it does not replace them. Nothing
        here removes a right you have under the consumer protection law of{' '}
        {COMPANY.country} or of the country you bought in.
      </P>
    </Section>
  </LegalPage>
);
