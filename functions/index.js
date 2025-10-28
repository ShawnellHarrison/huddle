/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onRequest} = require('firebase-functions/v2/https');
const {setGlobalOptions} = require('firebase-functions');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

// Set the maximum number of instances for cost control
setGlobalOptions({maxInstances: 10});

/**
 * Stripe webhook handler to grant premium access.
 */
exports.stripeWebhook = onRequest(
  {secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET']},
  async (request, response) => {
    let event;
    const signature = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      logger.error('⚠️  Webhook signature verification failed.', err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const {userId, userEmail} = session.metadata;

      if (!userId) {
        logger.error(
          '❌ Missing userId in Stripe checkout session metadata.',
          {session: session.id}
        );
        return response
          .status(400)
          .send('Bad Request: Missing userId in metadata.');
      }

      logger.info(
        `Processing successful payment for user ${userId} (${userEmail})`
      );

      try {
        const userRef = admin.firestore().collection('users').doc(userId);
        await userRef.set({isPremium: true}, {merge: true});

        logger.info(`✅ Premium access granted for user ${userId}`);
        response.status(200).json({received: true, accessGranted: true});
      } catch (error) {
        logger.error('🔥 Failed to grant premium access.', {
          userId: userId,
          error: error.message,
        });
        response
          .status(500)
          .send('Internal Server Error: Could not update user profile.');
      }
    } else {
      logger.info(`Ignoring unhandled event type: ${event.type}`);
      response.status(200).json({received: true, handled: false});
    }
  }
);
