import React from "react";
import Loader from "./Loader";

export default function ExchangeRatesTable({
  stockRates,
  buyFieldChange,
  saleFieldChange,
  buyFieldInputChange,
  saleFieldInputChange,
  onBuyFieldCancelClick,
  onSaleFieldCancelClick,
  isSomeElementEditing,
}) {
  return (
    <>
      <table id="currencyTable">
        <tbody>
          <tr>
            <td>Currency</td>
            <td>Buy</td>
            <td>Sell</td>
          </tr>
          {stockRates.map((element) => {
            let buyFieldValue;
            let saleFieldValue;

            if (element.buttonConfig.isBuyCellEditing) {
              buyFieldValue = element.buy;
            } else {
              if ((+element.buy).toFixed(2) % 1 === 0) {
                buyFieldValue = (+element.buy).toFixed(0);
              } else {
                buyFieldValue = (+element.buy).toFixed(2);
              }
            }

            if (element.buttonConfig.isSaleCellEditing) {
              saleFieldValue = element.sale;
            } else {
              if ((+element.sale).toFixed(2) % 1 === 0) {
                saleFieldValue = (+element.sale).toFixed(0);
              } else {
                saleFieldValue = (+element.sale).toFixed(2);
              }
            }

            return (
              <tr key={element.ccy} className="tableRow">
                <td>
                  {element.ccy}/{element.base_ccy}
                </td>
                <td>
                  <input
                    type="number"
                    value={buyFieldValue}
                    disabled={!element.buttonConfig.isBuyCellEditing}
                    onChange={(e) => buyFieldInputChange(e, element.id)()}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.isBuyCellEditing
                        ? "inactiveInput"
                        : ""
                    }
                    required
                  />
                  <button
                    id="editButton"
                    onClick={buyFieldChange(element.id)}
                    disabled={!element.buttonConfig.isBuyCellReadyToSave}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.isBuyCellEditing
                        ? "invisible"
                        : ""
                    }
                  >
                    {element.buttonConfig.isBuyCellEditing ? (
                      <span>&#10003;</span>
                    ) : (
                      <span>&#9998;</span>
                    )}
                  </button>
                  <button
                    onClick={onBuyFieldCancelClick(element.id)}
                    className={
                      !element.buttonConfig.isBuyCellEditing ? "invisible" : ""
                    }
                  >
                    &times;
                  </button>
                </td>
                <td>
                  <input
                    type="number"
                    value={saleFieldValue}
                    disabled={!element.buttonConfig.isSaleCellEditing}
                    onChange={(e) => saleFieldInputChange(e, element.id)()}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.isSaleCellEditing
                        ? "inactiveInput"
                        : ""
                    }
                    required
                  />
                  <button
                    id="editButton"
                    onClick={saleFieldChange(element.id)}
                    disabled={!element.buttonConfig.isSaleCellReadyToSave}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.isSaleCellEditing
                        ? "invisible"
                        : ""
                    }
                  >
                    {element.buttonConfig.isSaleCellEditing ? (
                      <span>&#10003;</span>
                    ) : (
                      <span>&#9998;</span>
                    )}
                  </button>
                  <button
                    onClick={onSaleFieldCancelClick(element.id)}
                    className={
                      !element.buttonConfig.isSaleCellEditing ? "invisible" : ""
                    }
                  >
                    &times;
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Loader />
    </>
  );
}
