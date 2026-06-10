'use client';

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ActionChainStage } from "../../lib/mongo";
import { StageItemDetails } from "./stageItemDetails";
import { Icon } from "../common/icon";

/**
 * A single stage rendered as a vertical-timeline row (rail dot + card). Clicking
 * the card toggles the on-chain details panel (preserves the prior StageItem
 * behavior). Shared across builder / receive / examples timelines.
 */
export const StageRow = ({
  stage,
  index,
  isFirst = false,
  lock = "self",
}: {
  stage: ActionChainStage;
  index: number;
  isFirst?: boolean;
  lock?: "self" | "sent" | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const n = index + 1;
  const txid = stage.TransactionID || "";
  const shortTxid =
    txid.length > 16 ? `${txid.slice(0, 8)}…${txid.slice(-7)}` : txid;
  const time = stage.Timestamp
    ? new Date(stage.Timestamp).toLocaleString()
    : "";

  const toggle = () => setIsExpanded((v) => !v);

  return (
    <div className="tl-row">
      <div className="tl-rail">
        <div
          className="tl-line top"
          style={{ background: isFirst ? "transparent" : undefined }}
        />
        <div className="tl-dot filled">{n}</div>
        <div className="tl-line" />
      </div>
      <div className="tl-body">
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          className="card card-pad"
          style={{ padding: 16, cursor: "pointer", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div className="disp" style={{ fontSize: 16.5 }}>
                {stage.title || "Untitled stage"}
              </div>
            </div>
            {lock === "sent" ? (
              <span className="badge">
                <Icon name="send" size={11} />
                Sent on
              </span>
            ) : lock === "self" ? (
              <span className="badge">
                <Icon name="unlock" size={11} />
                Held by you
              </span>
            ) : null}
          </div>

          {txid && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginTop: 13,
              }}
            >
              <span className="txid">
                <Icon name="check-circle" size={13} />
                <span className="faint" style={{ flex: "0 0 auto" }}>
                  txid
                </span>
                <span className="v">{shortTxid}</span>
                <button
                  type="button"
                  className="copybtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(txid);
                    toast.success("Transaction ID copied", { duration: 2000 });
                  }}
                  title="Copy transaction ID"
                  aria-label="Copy transaction ID"
                >
                  <Icon name="copy" size={13} />
                </button>
              </span>
              {time && (
                <span
                  className="faint mono"
                  style={{ fontSize: 11, flex: "0 0 auto" }}
                >
                  {time}
                </span>
              )}
            </div>
          )}

          <div
            className="faint"
            style={{
              fontSize: 12,
              marginTop: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Icon name={isExpanded ? "chevron-down" : "chevron-right"} size={13} />
            {isExpanded ? "Hide details" : "View on-chain details"}
          </div>
        </div>

        {isExpanded && (
          <div style={{ marginTop: 12 }}>
            <StageItemDetails
              key={txid}
              transactionId={txid}
              imageURL={stage.imageURL}
              onClose={() => setIsExpanded(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
