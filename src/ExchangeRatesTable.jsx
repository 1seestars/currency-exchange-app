import React from "react";
import Loader from "./Loader";

export default function ExchangeRatesTable({
  stockRates,
  onFieldChange,
  tableInputChange,
  fieldCancelEdit,
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

            if (element.buttonConfig.buyCellEditing) {
              buyFieldValue = element.buy;
            } else {
              if ((+element.buy).toFixed(2) % 1 === 0) {
                buyFieldValue = (+element.buy).toFixed(0);
              } else {
                buyFieldValue = (+element.buy).toFixed(2);
              }
            }

            if (element.buttonConfig.saleCellEditing) {
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
                    disabled={!element.buttonConfig.buyCellEditing}
                    onChange={tableInputChange(element.id, "buy")}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.buyCellEditing
                        ? "inactiveInput"
                        : ""
                    }
                    required
                  />
                  <button
                    id="editButton"
                    onClick={onFieldChange(element.id, "buy")}
                    disabled={!element.buttonConfig.buyCellReadyToSave}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.buyCellEditing
                        ? "invisible"
                        : ""
                    }
                  >
                    {element.buttonConfig.buyCellEditing ? (
                      <span>&#10003;</span>
                    ) : (
                      <span>&#9998;</span>
                    )}
                  </button>
                  <button
                    onClick={fieldCancelEdit(element.id, "buy")}
                    className={
                      !element.buttonConfig.buyCellEditing ? "invisible" : ""
                    }
                  >
                    &times;
                  </button>
                </td>
                <td>
                  <input
                    type="number"
                    value={saleFieldValue}
                    disabled={!element.buttonConfig.saleCellEditing}
                    onChange={tableInputChange(element.id, "sale")}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.saleCellEditing
                        ? "inactiveInput"
                        : ""
                    }
                    required
                  />
                  <button
                    id="editButton"
                    onClick={onFieldChange(element.id, "sale")}
                    disabled={!element.buttonConfig.saleCellReadyToSave}
                    className={
                      isSomeElementEditing &&
                      !element.buttonConfig.saleCellEditing
                        ? "invisible"
                        : ""
                    }
                  >
                    {element.buttonConfig.saleCellEditing ? (
                      <span>&#10003;</span>
                    ) : (
                      <span>&#9998;</span>
                    )}
                  </button>
                  <button
                    onClick={fieldCancelEdit(element.id, "sale")}
                    className={
                      !element.buttonConfig.saleCellEditing ? "invisible" : ""
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
