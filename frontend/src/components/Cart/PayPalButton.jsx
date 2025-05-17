import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPalButton({ amount, onSuccess, onError }) {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AVNFQVmvgbNF1_vlt1FDqvPX6NFODF27Qb0jw9EMuoMBlghjP72AmZyn7lI1sIBx2EkO9jBF1LItibht",
      }}
    >
      <PayPalButtons 
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount
                }
              }
            ]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={(err) => {
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;