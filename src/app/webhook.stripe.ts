/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import { Request, Response } from 'express';
import config from './config';
import sendEmail from '../utils/sendEmail';

const stripe = new Stripe(config.stripe_secret_key as string);


function isNonEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.length > 0;
}

function isLiveCustomer(
  c: Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): c is Stripe.Customer {
  return !!c && !('deleted' in c && c.deleted === true);
}

// Pull email from Stripe (Checkout session + fallbacks)
export async function getEmailFromStripeSession(
  sessionId: string
): Promise<string | undefined> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['customer', 'payment_intent', 'payment_intent.latest_charge'],
  });

  // payment_intent.latest_charge can be string | Charge | null
  const pi = (session.payment_intent ?? null) as Stripe.PaymentIntent | null;
  let chargeEmail: string | undefined;
  if (pi?.latest_charge && typeof pi.latest_charge !== 'string') {
    const ch = pi.latest_charge as Stripe.Charge;
    chargeEmail = ch.billing_details?.email ?? undefined; // null → undefined
  }

  const customerObj =
    typeof session.customer === 'string' ? undefined : session.customer;

  const candidates: Array<string | undefined> = [
    session.customer_details?.email ?? undefined, // (string | null) → string | undefined
    session.customer_email ?? undefined,          // (string | null) → string | undefined
    isLiveCustomer(customerObj) ? customerObj.email ?? undefined : undefined,
    chargeEmail,
  ];

  // pick first non-empty string
  let email = candidates.find(isNonEmptyString);

  // last resort: fetch customer if we only have an id string
  if (!email && typeof session.customer === 'string') {
    const cust = await stripe.customers.retrieve(session.customer);
    if (isLiveCustomer(cust as any)) {
      const c = cust as Stripe.Customer;
      if (isNonEmptyString(c.email)) email = c.email;
    }
  }

  return email;
}

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = config.webhook_secret_key;

  if (!sig || !webhookSecret) {
    // 400 => Stripe will NOT retry; correct because this is a bad request
    return res.status(400).send('Missing Stripe signature or webhook secret');
  }

  let event: Stripe.Event;
  try {
    // req.body is a raw Buffer (because of bodyParser.raw on this route)
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err?.message);
    // 400 => do not retry (invalid signature)
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const raw = event.data.object as Stripe.Checkout.Session;

        // Expand everything we’ll need in one round-trip
        const session = await stripe.checkout.sessions.retrieve(raw.id, {
          expand: ['line_items', 'payment_intent', 'payment_intent.latest_charge', 'customer'],
        });

        // Your reference(s)
        const orderRef =
          session.client_reference_id ||
          session.metadata?.bookProcessId ||
          session.metadata?.bookServiceId;

        // Email from Stripe (truth)
        const email = await getEmailFromStripeSession(session.id);

        // Common useful fields
        const currency = session.currency?.toUpperCase();
        const amountTotal = session.amount_total ?? 0; // minor units (e.g., cents/fils)
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent as Stripe.PaymentIntent | null)?.id;

        const items =
          session.line_items?.data?.map((li) => ({
            description: li.description,
            quantity: li.quantity ?? 1,
            amount_total: li.amount_total,       // minor units
            amount_subtotal: li.amount_subtotal, // minor units
            currency,
            priceId:
              typeof li.price === 'string'
                ? li.price
                : (li.price as Stripe.Price | null)?.id,
          })) ?? [];

        // TODO: persist in your DB
        // await OrderService.markPaid({
        //   orderRef,
        //   checkoutSessionId: session.id,
        //   paymentIntentId,
        //   amountTotal,
        //   currency,
        //   items,
        //   customerSnapshot: {
        //     email,
        //     name: session.customer_details?.name
        //       || (typeof session.customer !== 'string'
        //             ? (session.customer as Stripe.Customer).name ?? undefined
        //             : undefined),
        //     phone: session.customer_details?.phone
        //       || (typeof session.customer !== 'string'
        //             ? (session.customer as Stripe.Customer).phone ?? undefined
        //             : undefined),
        //     address: session.customer_details?.address
        //       || (typeof session.customer !== 'string'
        //             ? (session.customer as Stripe.Customer).address ?? undefined
        //             : undefined),
        //   },
        //   metadata: session.metadata ?? {},
        // });
        // Send confirmation email (if available)


        if (email) {
          await sendEmail({
            from: config.SMTP_USER as string,
            to: email,
            subject: 'Payment received',
            text: `Thanks! Your payment was successful.\nRef: ${orderRef ?? session.id}`,
          });
        }

        break;
      }

   case 'invoice.payment_failed': {
  const invoice = event.data.object as Stripe.Invoice;

  // 1) try the invoice's own customer_email first
  let email: string | undefined = invoice.customer_email ?? undefined;

  // 2) if the invoice has an expanded customer object, use it (but narrow!)
  if (!email && typeof invoice.customer !== 'string' && invoice.customer) {
    const c = invoice.customer; // Stripe.Customer | Stripe.DeletedCustomer

    // DeletedCustomer has a boolean `deleted: true` and no email
    if (!('deleted' in c && c.deleted === true)) {
      email = (c as Stripe.Customer).email ?? undefined;
    }
  }

  // 3) if only an id is present, fetch the customer and narrow
  if (!email && typeof invoice.customer === 'string') {
    const cust = await stripe.customers.retrieve(invoice.customer);
    // `cust` is Stripe.Response<Customer | DeletedCustomer>
    // Deleted customers have `deleted: true`
    if (!('deleted' in cust && (cust as any).deleted === true)) {
      email = (cust as Stripe.Customer).email ?? undefined;
    }
  }

  if (email) {
    await sendEmail({
      from: config.SMTP_USER as string,
      to: email,
      subject: 'Payment failed',
      text: 'Your payment failed. Please update your payment method.',
    });
  }

  break;
}

      default: {
        // Log and ignore events you don’t handle
        console.log(`Unhandled event type: ${event.type}`);
        break;
      }
    }

    // 200 => Stripe stops retrying
    return res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    // 500 => Stripe WILL retry later (good for transient failures)
    return res.status(500).send('Webhook handler failure');
  }
};
