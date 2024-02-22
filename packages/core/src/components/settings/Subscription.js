import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, NavItem, NavLink, Alert } from 'reactstrap';
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

const Subscription = ({ status, session_id }) => {
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
      <Col>
        <div key={a.id}>
          <div>${displayAmount(a.amount)} per month</div>
          <div>{a.name}</div>
          <div>{a.price}</div>
          <Button onClick={() => handleClick(a.id)}>Checkout</Button>
        </div>
      </Col>
    );
  });

  if (!subscriptionsDisplay) {
    return (
      <div>
        <h4>Choose a plan</h4>
        <Row>{plans}</Row>
        {paymentCanceled() && <Alert color="danger">{paymentCanceled()}</Alert>}
      </div>
    );
  } else
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

export default Subscription;

//Displays latest subscription end period
const displayCurrentSubscription = (subscription) => {
  if (subscription?.length > 0) {
    const lastSubcription = subscription[subscription.length - 1];
    lastSubcription.format = 'date';
    const displayDate = format(
      new Date(lastSubcription.current_period_end * 1000),
      getDateTimeFormat(lastSubcription)
    );
    const planName = lastSubcription.plan.nickname;
    return (
      <div>
        Current subscription to &quot;{planName}&quot; plan ends on{' '}
        {displayDate}
      </div>
    );
  }
};
