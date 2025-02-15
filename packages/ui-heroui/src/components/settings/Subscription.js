import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useBaseOwnerId } from '@rhino-project/core/hooks';

import {
  displayAmount,
  CreateCheckoutSession,
  usePrices,
  useSubscription,
  useCheckSession,
  createCancellation
} from '@rhino-project/core/queries';
import { useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@heroui/react';
import { Icon } from '@iconify/react';

export const Subscription = ({ status, session_id }) => {
  const baseOwnerId = useBaseOwnerId();
  const queryClient = useQueryClient();

  const { isInitialLoading, data: { data: prices } = {} } = usePrices();
  const { isSuccess, data: { data: subscriptions } = {} } =
    useSubscription(baseOwnerId);

  const {
    isCheckSessionSuccess = isSuccess,
    data: { data: sessionMatch } = {}
  } = useCheckSession(baseOwnerId, session_id);

  const sessionCheckError = () => {
    if (session_id && !sessionMatch?.session_matched && isCheckSessionSuccess) {
      return ' There was a problem with with your payment. Please contact admin ';
    }
  };
  const paymentCanceled = () => {
    if (status === 'canceled') return 'Payment was canceled';
  };

  const hasSubscription = subscriptions?.subscriptions?.length > 0;
  const currentSubscription = hasSubscription
    ? subscriptions?.subscriptions?.[subscriptions?.subscriptions?.length - 1]
    : null;

  const handleClick = useCallback(
    (e) => CreateCheckoutSession(e, baseOwnerId),
    [baseOwnerId]
  );

  const handleCancelClick = useCallback(async () => {
    await createCancellation(baseOwnerId);
    queryClient.invalidateQueries(['getSubscription']);
  }, [baseOwnerId, queryClient]);

  if (isInitialLoading || !isSuccess) return null;

  const plans = prices?.prices?.map((a) => {
    return (
      <Card key={a.id}>
        <CardHeader>
          <p className="text-md">{a.product.name}</p>
        </CardHeader>
        <CardBody>
          <div>
            ${displayAmount(a.unit_amount)} per {a?.recurring?.interval}
          </div>

          <div>{a.price}</div>
        </CardBody>
        <CardFooter>
          <Button
            onClick={() => handleClick(a.id)}
            startContent={<Icon className="size-4" icon="bi:cart" />}
          >
            Checkout
          </Button>
        </CardFooter>
      </Card>
    );
  });

  if (!hasSubscription) {
    return (
      <div>
        <h4>Choose a plan</h4>
        <div className="flex flex-row flex-wrap gap-2">{plans}</div>
        {paymentCanceled() && <Alert color="danger">{paymentCanceled()}</Alert>}
      </div>
    );
  }

  const displayDate = format(
    new Date(currentSubscription.current_period_end * 1000),
    'MMMM d, yyyy'
  );
  const planName = currentSubscription.plan.product.name;

  return (
    <div>
      <h4>
        Current subscription to &quot;{planName}&quot; plan ends on{' '}
        {displayDate}
      </h4>
      <Button onClick={handleCancelClick}>Cancel</Button>

      {!sessionCheckError() && status === 'success' && (
        <Alert
          color="success"
          title="Payment completed successfully"
          description="Thanks for subscribing"
        />
      )}
      {sessionCheckError() && (
        <Alert color="danger" title={sessionCheckError()} />
      )}
    </div>
  );
};

Subscription.propTypes = {
  status: PropTypes.oneOf(['success', 'canceled']),
  session_id: PropTypes.string
};
