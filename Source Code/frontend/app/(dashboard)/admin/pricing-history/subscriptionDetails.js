import React from "react";
import { Modal, Divider } from "antd";
import { columnFormatter } from "../../../helpers/utils";
import { useCurrency } from "../../../contexts/site";

const SubscriptionModal = ({ isVisible, onClose, subscriptionData }) => {
  if (!subscriptionData) {
    return null;
  }
  const {currencySymbol} = useCurrency()

  const {
    uid,
    user,
    subscription,
    currency,
    price,
    active,
    payment,
    start_date,
    end_date,
  } = subscriptionData;

  return (
    <Modal
      title={<h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      className="custom-modal bg-white rounded-lg shadow-md max-w-2xl mx-auto"
    >
      <div className="p-2 space-y-6">
        {/* User Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800">User Information</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong className="font-medium">Name:</strong> {user?.name}
            </p>
            <p>
              <strong className="font-medium">Email:</strong> <span className="text-gray-500">{user?.email}</span>
            </p>
          </div>
        </section>

        <Divider />

        {/* Subscription Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800">Subscription Details</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong className="font-medium">Subscription:</strong> {columnFormatter(subscription?.name)}
            </p>
            <p>
              <strong className="font-medium">Subscription ID:</strong> {uid}
            </p>
          </div>
        </section>

        <Divider />

        {/* Payment Details */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong className="font-medium">Price:</strong> {currencySymbol} {price}
            </p>
            <p>
              <strong className="font-medium">Method:</strong> {payment?.method}
            </p>
            <p>
              <strong className="font-medium">Transaction ID:</strong> {payment?.transaction_id}
            </p>
            <p>
              <strong className="font-medium">Status:</strong>
              <span
                className={`font-medium ml-2 ${payment?.status === "paid" ? "text-green-600" : "text-red-600"}`}
              >
                {payment?.status}
              </span>
            </p>
          </div>
        </section>

        <Divider />

        {/* Subscription Period */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800">Subscription Period</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong className="font-medium">Start Date:</strong> {new Date(start_date).toLocaleDateString()}
            </p>
            <p>
              <strong className="font-medium">End Date:</strong> {new Date(end_date).toLocaleDateString()}
            </p>
            <p>
              <strong className="font-medium">Status:</strong>
              <span
                className={`font-medium ml-2 ${active ? "text-green-600" : "text-red-600"}`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
