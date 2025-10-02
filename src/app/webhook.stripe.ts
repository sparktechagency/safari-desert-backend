// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Stripe from 'stripe';
// import { Request, Response } from 'express';
// import httpStatus from 'http-status';

// import config from '../config';
// import catchAsync from '../utils/catchAsync';
// import AppError from '../../errors/AppError';
// import { UserServices } from '../../modules/User/user.services';

// import sendEmail from '../../utils/sendEmail';
// import BookServiceModel from '../../modules/BookService/bookservice.model';
// import addPeriodToDate from '../../utils/addPeriodDate';

// // import billingServices from '../modules/billingModule/billing.services';

// const stripe = new Stripe(config.stripe_secret_key as string);

// export const stripeWebhookHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const sig = req.headers['stripe-signature']!;
//     const webhookSecret = config.webhook_secret_key;

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
//     } catch (err: any) {
//       console.error('Webhook signature verification failed:', err.message);
//       throw new AppError(httpStatus.BAD_REQUEST, 'No items in the order.');
//     }

//     const session = event.data.object as Stripe.Checkout.Session;
//     const userId = session.customer as string;

//     const user = await UserServices.getSingleUserFromDB(userId);

//     if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'No user found.');
//     // helper: map Stripe timestamp to Date

//     switch (event.type) {
//       // case 'checkout.session.completed': {
//       //   console.log('Checkout session completed');

//       //   const bookServiceId =
//       //     session.metadata?.bookServiceId || session.client_reference_id || '';
//       //   console.log('book service id from webhook 2--------->', bookServiceId);
//       //   // 1) Update the specific BookService (if you provided its id in metadata)
//       //   if (bookServiceId) {
//       //     try {
//       //       await BookServiceModel.findByIdAndUpdate(
//       //         bookServiceId,
//       //         { $set: { paymentStatus: 'paid', paidAt: new Date() } },
//       //         { new: true },
//       //       );
//       //       console.log(`BookService ${bookServiceId} marked as paid`);
//       //     } catch (e) {
//       //       console.error('BookService update failed:', e);
//       //     }
//       //   } else {
//       //     console.warn(
//       //       'No bookServiceId found in session metadata/client_reference_id',
//       //     );
//       //   }

//       //   break;
//       // }
//       case 'checkout.session.completed': {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const metadata = session.metadata || {};

//         const isSubscription =
//           Boolean(metadata.plan) || Boolean(metadata.membershipId);

//         // resolve user (id or email)
//         let user: any = null;
//         const possibleUserId =
//           (metadata.userId as string | undefined) ||
//           (session.customer as string | undefined);
//         if (possibleUserId) {
//           try {
//             user = await UserServices.getSingleUserFromDB(possibleUserId);
//           } catch (error) {
//             console.log(error);
//           }
//         }
//         if (!user && session.customer_email) {
//           try {
//             user = await UserServices.getSingleUserFromDB(
//               session.customer_email,
//             );
//           } catch (error) {
//             console.log(error);
//           }
//         }

//         if (isSubscription) {
//           // ---------------- SUBSCRIPTION FLOW ----------------
//           if (user) {
//             const plan =
//               metadata.plan === 'yearly'
//                 ? 'yearly'
//                 : ('monthly' as 'monthly' | 'yearly');
//             const price = parseFloat(
//               String(
//                 metadata.price || Number(session.amount_total || 0) / 100 || 0,
//               ),
//             );

//             const now = new Date();
//             let startedAt = now;
//             if (
//               user.subscription?.expiryDate &&
//               new Date(user.subscription.expiryDate) > now
//             ) {
//               startedAt = new Date(user.subscription.expiryDate);
//             }

//             const expiryDate = addPeriodToDate(startedAt, plan);

   
//             user.subscription = {
//               membershipId:
//                 (metadata.membershipId as string) ||
//                 user.subscription?.membershipId,
//               plan,
//               price,
//               startedAt,
//               expiryDate,
//               status: 'active',
//             };
//             if (session.customer)
//               user.stripeCustomerId = String(session.customer);
//      //  Update role logic
//  if (user.role === 'user' || user.role === 'vipMember') {
//   user.role = 'vipMember';
// } else if (user.role === 'contractor' || user.role === 'vipContractor') {
//   user.role = 'vipContractor';
// }


//       await user.save();
//             console.log(
//               `Subscription activated for ${user.email} until ${expiryDate} with role ${user.role}`,
//             );

//             try {
//               await sendEmail({
//                 from: config.SMTP_USER as string,
//                 to: user.email,
//                 subject: 'Subscription activated',
//                 text: `Your subscription is active until ${expiryDate.toISOString()}`,
//               });
//             } catch (e) {
//               console.warn('Email send failed:', e);
//             }
//           } else {
//             console.warn(
//               'Subscription session completed but user not found:',
//               session.id,
//             );
//           }
//         } else {
//           // ---------------- ONE-TIME SERVICE FLOW ----------------
//           const bookServiceId =
//             (metadata.bookServiceId as string) ||
//             (session.client_reference_id as string) ||
//             '';
//           if (bookServiceId) {
//             await BookServiceModel.findByIdAndUpdate(
//               bookServiceId,
//               { $set: { paymentStatus: 'paid', paidAt: new Date() } },
//               { new: true },
//             );
//             console.log(`BookService ${bookServiceId} marked as paid`);
//           } else {
//             console.warn(
//               'No bookServiceId found in one-time checkout session',
//               session.id,
//             );
//           }
//         }
//         break;
//       }
//       case 'invoice.payment_failed': {
//         console.warn('Payment failed for invoice', session.id);

//         const content = `Your subscription purchase has failed!`;
//         await sendEmail({
//           from: config.SMTP_USER as string,
//           to: user.email,
//           subject: 'Illuminate Muslim Minds - Subscription Payment Failed',
//           text: content,
//         });
//         break;
//       }
//     }

//     res.status(200).json({ received: true });
//   },
// );
