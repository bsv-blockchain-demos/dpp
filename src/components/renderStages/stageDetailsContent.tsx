'use client';

import { toast } from "react-hot-toast";
import { Icon } from "../common/icon";
import { CoachCard } from "../common/coach-card";
import { Spinner } from "../ui/spinner";

export interface StageDetailsData {
  [key: string]: unknown;
  _metadata?: {
    receiver: string;
    canDecrypt: boolean;
    decryptionError: string | null;
    sender?: string;
  };
}

/**
 * Shared presentation for the stage-details panel and full modal: identical
 * visual language at two sizes. Pure presentational: the parent owns the fetch
 * + decrypt state and passes it in.
 */
export function StageDetailsContent({
  transactionId,
  imageURL,
  data,
  isLoading,
  error,
  onRetry,
}: {
  transactionId: string;
  imageURL?: string;
  data: StageDetailsData | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const meta = data?._metadata;
  const isSelf = meta?.receiver === "Self (your wallet)";
  const canDecrypt = meta?.canDecrypt;
  const shortTxid =
    transactionId.length > 18
      ? `${transactionId.slice(0, 10)}…${transactionId.slice(-8)}`
      : transactionId;
  const json = data
    ? JSON.stringify(
        Object.fromEntries(
          Object.entries(data).filter(([key]) => key !== "_metadata"),
        ),
        null,
        2,
      )
    : "";

  return (
    <>
      {isLoading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 0" }}>
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <CoachCard icon="alert-triangle" tone="warn" title="Couldn't load this stage">
          {error}
          <div style={{ marginTop: 10 }}>
            <button type="button" className="btn btn-soft btn-sm" onClick={onRetry}>
              <Icon name="refresh" size={14} />
              Retry
            </button>
          </div>
        </CoachCard>
      )}

      {!isLoading && !error && data && (
        <>
          {/* status badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {isSelf ? (
              <span className="badge">
                <Icon name="unlock" size={11} />
                Held by you
              </span>
            ) : (
              <span className="badge badge-accent">
                <Icon name="lock" size={11} />
                Locked to receiver
              </span>
            )}
            {canDecrypt ? (
              <span className="badge badge-ok">
                <Icon name="unlock" size={11} />
                Decrypted for you
              </span>
            ) : (
              <span className="badge badge-warn">
                <Icon name="lock" size={11} />
                Encrypted
              </span>
            )}
          </div>

          {imageURL && (
            <div style={{ height: 110, borderRadius: "var(--r-sm)", overflow: "hidden", border: "1px solid var(--line)", background: "var(--surface-2)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageURL} alt="Stage photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* sender / receiver */}
          {meta && (
            <div style={{ display: "grid", gridTemplateColumns: meta.sender ? "1fr 1fr" : "1fr", gap: 12 }}>
              {meta.sender && (
                <div className="card-flat" style={{ padding: 13 }}>
                  <div className="faint" style={{ fontSize: 11, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="send" size={12} />
                    Sent by
                  </div>
                  <div className="mono" style={{ fontSize: 12.5, wordBreak: "break-all" }}>
                    {meta.sender.slice(0, 12)}…{meta.sender.slice(-8)}
                  </div>
                </div>
              )}
              <div className="card-flat" style={{ padding: 13 }}>
                <div className="faint" style={{ fontSize: 11, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="key-round" size={12} />
                  Locked to
                </div>
                <div className="mono" style={{ fontSize: 12.5, wordBreak: "break-all" }}>
                  {isSelf ? (
                    <>
                      your wallet <span className="accent-tx">(you)</span>
                    </>
                  ) : (
                    <>
                      {meta.receiver.slice(0, 12)}…{meta.receiver.slice(-8)}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* decryption coach */}
          {canDecrypt ? (
            <CoachCard icon="unlock" tone="ok" title="Unlocked with your wallet">
              This stage was encrypted to your wallet ID. Your key decrypted the data below; to anyone else it is just ciphertext.
            </CoachCard>
          ) : (
            <CoachCard icon="lock" tone="warn" title="Can't decrypt this stage">
              {meta?.decryptionError ||
                "This stage is encrypted to another wallet, so its data can't be shown here."}
            </CoachCard>
          )}

          {/* decrypted data */}
          {canDecrypt !== false && (
            <div className="field">
              <span className="label">
                <Icon name="scroll-text" size={14} style={{ color: "var(--ink-3)" }} />
                Stage data
              </span>
              <pre className="code" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {json}
              </pre>
            </div>
          )}

          {/* txid */}
          <div className="txid">
            <Icon name="check-circle" size={13} />
            <span className="faint" style={{ flex: "0 0 auto" }}>
              txid
            </span>
            <span className="v">{shortTxid}</span>
            <button
              type="button"
              className="copybtn"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(transactionId);
                  toast.success("Transaction ID copied", { duration: 2000 });
                } catch {
                  toast.error("Couldn't copy. Copy the txid manually.", { duration: 3000 });
                }
              }}
              title="Copy transaction ID"
              aria-label="Copy transaction ID"
            >
              <Icon name="copy" size={13} />
            </button>
          </div>
        </>
      )}
    </>
  );
}
