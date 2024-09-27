import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { NavItem, NavLink, Alert, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';
import { format } from 'date-fns';
import { useBaseOwnerId } from '../../hooks/owner';

import { getDateTimeFormat } from '../../utils/ui';
import {
  displayAmount,
  CreateCheckoutSession,
  usePrices,
  useSubscription,
  useCheckSession,
  createCancellation
} from '../../queries/subscription';
import { Button } from '../buttons';
import { DangerAlert, SuccessAlert } from '../alerts';
import { useQueryClient } from '@tanstack/react-query';

export const SubscriptionTab = ({ activeTab, toggle }) => {
  return (
    <NavItem>
      <NavLink
        className={classnames({ active: activeTab === 'subscription' })}
        onClick={() => {
          toggle('subscription');
        }}
      >
        Subscription
      </NavLink>
    </NavItem>
  );
};

SubscriptionTab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired
};

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
        <CardBody>
          <h4>{a.product.name}</h4>
          <div>
            ${displayAmount(a.unit_amount)} per {a?.recurring?.interval}
          </div>

          <div>{a.price}</div>
          <Button onClick={() => handleClick(a.id)}>Checkout</Button>
        </CardBody>
      </Card>
    );
  });

  if (!hasSubscription) {
    return (
      <div>
        <h4>Choose a plan</h4>
        <div className="d-flex flex-row flex-wrap gap-2">{plans}</div>
        {paymentCanceled() && <Alert color="danger">{paymentCanceled()}</Alert>}
      </div>
    );
  }

  currentSubscription.format = 'date';
  const displayDate = format(
    new Date(currentSubscription.current_period_end * 1000),
    getDateTimeFormat(currentSubscription)
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
        <SuccessAlert
          title="Payment completed successfully"
          description={'Thanks for subscribing.'}
        />
      )}
      {sessionCheckError() && <DangerAlert title={sessionCheckError()} />}
    </div>
  );
};

Subscription.propTypes = {
  status: PropTypes.oneOf(['success', 'canceled']),
  session_id: PropTypes.string
};
