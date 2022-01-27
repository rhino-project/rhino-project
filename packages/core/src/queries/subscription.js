import qs from 'qs';
import { useQuery } from 'react-query';

import { loadStripe as Stripe } from '@stripe/stripe-js';
import { networkApiCall } from 'rhino/lib/networking';

const GET_PRICES_API_PATH = 'api/subscription/prices';
const CHECKOUT_API_PATH = 'api/subscription/create-checkout-session';
const SUBSCRIPTION_API_PATH = 'api/subscription/subscriptions';
const CHECK_SESSION_API_PATH = 'api/subscription/check_session_id?';
const CANCEL_URL = '/settings?status=canceled';
const SUCCESS_URL = '/settings?status=success&session_id={CHECKOUT_SESSION_ID}';

// Create a Checkout Session with the selected plan ID
export async function CreateCheckoutSession(price, baseOwnerId) {
  const stripe = await Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  const {
    data: { sessionId }
  } = await networkApiCall(CHECKOUT_API_PATH, {
    method: 'POST',
    data: JSON.stringify({
      base_owner_id: baseOwnerId,
      price: price,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL
    })
  });
  stripe.redirectToCheckout({ sessionId: sessionId });
}

export const usePrices = () => {
  return useSubscriptionQuery('usePrices', GET_PRICES_API_PATH);
};

export const useSubscription = (baseOwnerId) => {
  return useSubscriptionQuery(
    'getSubscription',
    SUBSCRIPTION_API_PATH + '?base_owner_id=' + baseOwnerId
  );
};

export const useCheckSession = (baseOwnerId, session_id) => {
  const queryParam = qs.stringify({
    base_owner_id: baseOwnerId,
    session_id: session_id
  });
  return useSubscriptionQuery(
    'checkSession',
    CHECK_SESSION_API_PATH + queryParam
  );
};

const useSubscriptionQuery = (queryKey, queryPath, params) => {
  return useQuery(queryKey, () => networkApiCall(queryPath, params));
};

export const displayAmount = (amount) => {
  return amount / 100; //FIXME  set currency in env
};
