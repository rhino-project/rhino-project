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
  useCheckSession
} from '../../queries/subscription';
import { Button } from '../buttons';
import { DangerAlert, SuccessAlert } from '../alerts';

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

  const subscriptionsDisplay = displayCurrentSubscription(
    subscriptions?.subscriptions
  );
  const handleClick = useCallback(
    (e) => {
      CreateCheckoutSession(e, baseOwnerId);
    },
    [baseOwnerId]
  );

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

  if (!subscriptionsDisplay) {
    return (
      <div>
        <h4>Choose a plan</h4>
        <div className="d-flex flex-row flex-wrap gap-2">{plans}</div>
        {paymentCanceled() && <Alert color="danger">{paymentCanceled()}</Alert>}
      </div>
    );
  }

  return (
    <div>
      <h4>{subscriptionsDisplay}</h4>
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

//Displays latest subscription end period
const displayCurrentSubscription = (subscription) => {
  if (subscription?.length > 0) {
    const lastSubcription = subscription[subscription.length - 1];
    lastSubcription.format = 'date';
    const displayDate = format(
      new Date(lastSubcription.current_period_end * 1000),
      getDateTimeFormat(lastSubcription)
    );
    const planName = lastSubcription.plan.product.name;
    return (
      <div>
        Current subscription to &quot;{planName}&quot; plan ends on{' '}
        {displayDate}
      </div>
    );
  }
};
