import qs from 'qs';
import { useQuery } from '@tanstack/react-query';

import { loadStripe as Stripe } from '@stripe/stripe-js';
import { networkApiCall } from '../lib/networking';
import { useRhinoConfig } from '@rhino-project/config';

const GET_PRICES_API_PATH = 'api/subscription/prices';
const CHECKOUT_API_PATH = 'api/subscription/create-checkout-session';
const SUBSCRIPTION_API_PATH = 'api/subscription/subscriptions';
const CHECK_SESSION_API_PATH = 'api/subscription/check_session_id?';
const CANCEL_URL = '/settings?status=canceled';
const SUCCESS_URL = '/settings?status=success&session_id={CHECKOUT_SESSION_ID}';

// Create a Checkout Session with the selected plan ID
export async function CreateCheckoutSession(price, base_owner_id) {
  const {
    env: { STRIPE_PUBLISHABLE_KEY }
  } = useRhinoConfig();
  const stripe = await Stripe(STRIPE_PUBLISHABLE_KEY);
  const {
    data: { sessionId }
  } = await networkApiCall(CHECKOUT_API_PATH, {
    method: 'POST',
    data: {
      base_owner_id,
      price,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL
    }
  });
  stripe.redirectToCheckout({ sessionId: sessionId });
}

export const usePrices = () => {
  return useSubscriptionQuery(['usePrices'], GET_PRICES_API_PATH);
};

export const useSubscription = (baseOwnerId) => {
  return useSubscriptionQuery(
    ['getSubscription'],
    SUBSCRIPTION_API_PATH + '?base_owner_id=' + baseOwnerId
  );
};

export const useCheckSession = (baseOwnerId, session_id) => {
  const queryParam = qs.stringify({
    base_owner_id: baseOwnerId,
    session_id: session_id
  });
  return useSubscriptionQuery(
    ['checkSession'],
    CHECK_SESSION_API_PATH + queryParam
  );
};

const useSubscriptionQuery = (queryKey, queryPath, params) => {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: ({ signal }) => networkApiCall(queryPath, { ...params, signal })
  });
};

export const displayAmount = (amount) => {
  return amount / 100; //FIXME  set currency in env
};
