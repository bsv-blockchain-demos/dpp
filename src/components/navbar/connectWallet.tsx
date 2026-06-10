'use client';

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useWalletContext } from "../../context/walletContext";
import { Spinner } from "../ui/spinner";
import { Icon } from "../common/icon";

export const ConnectWallet = () => {
    const { userPubKey, isConnecting, initializeWallet, disconnect } = useWalletContext();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Disconnected (or connecting): show the connect button.
    if (!userPubKey) {
        return (
            <button
                onClick={() => initializeWallet()}
                disabled={isConnecting}
                className="connect connect-off"
                title="Connect your wallet"
            >
                {isConnecting ? (
                    <>
                        <Spinner size="sm" />
                        <span>Connecting…</span>
                    </>
                ) : (
                    <>
                        <span className="dot" />
                        <span>Connect wallet</span>
                    </>
                )}
            </button>
        );
    }

    // Connected: dropdown with identity key + logout.
    const short = `${userPubKey.slice(0, 6)}…${userPubKey.slice(-4)}`;

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="connect"
                aria-haspopup="menu"
                aria-expanded={open}
                title="Wallet menu"
            >
                <span className="dot" />
                <span className="key">{short}</span>
                <Icon name={open ? "chevron-up" : "chevron-down"} size={14} />
            </button>

            {open && (
                <div className="wallet-menu" role="menu">
                    <div className="wallet-menu-head">
                        <Icon name="link" size={15} />
                        Wallet connected
                    </div>
                    <div style={{ padding: "8px 14px 12px" }}>
                        <div
                            className="faint"
                            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}
                        >
                            Identity key
                        </div>
                        <div className="wallet-key">
                            <span className="mono" style={{ fontSize: 11.5, wordBreak: "break-all", lineHeight: 1.5, minWidth: 0 }}>
                                {userPubKey}
                            </span>
                            <button
                                type="button"
                                className="copybtn"
                                onClick={() => {
                                    navigator.clipboard.writeText(userPubKey);
                                    toast.success("Identity key copied", { duration: 2000 });
                                }}
                                title="Copy identity key"
                                aria-label="Copy identity key"
                            >
                                <Icon name="copy" size={14} />
                            </button>
                        </div>
                    </div>
                    <hr className="divider" />
                    <button
                        type="button"
                        className="wallet-menu-item"
                        role="menuitem"
                        onClick={() => {
                            disconnect();
                            setOpen(false);
                            toast.success("Wallet disconnected", { duration: 2000 });
                        }}
                    >
                        <Icon name="log-out" size={15} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};
