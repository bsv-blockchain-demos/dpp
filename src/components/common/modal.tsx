'use client';

import { useEffect, useRef } from "react";
import { Icon, type IconName } from "./icon";

/**
 * Token-styled modal shell (unified dialog language for create-stage and
 * stage-details). Click-outside + Escape close, focus moves to the panel on
 * open, body scroll locked while open, tw-animate-css entrance. Controlled via
 * `open` so existing isOpen/onClose flows are preserved.
 */
export function Modal({
  open,
  onClose,
  icon,
  title,
  sub,
  children,
  footer,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  icon?: IconName;
  title: string;
  sub?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep the latest onClose in a ref so the focus/scroll-lock effect below can
  // depend on `open` alone; otherwise a parent that recreates onClose each
  // render would re-run the effect on every keystroke and steal input focus.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="dp-backdrop animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="card dp-modal animate-in fade-in zoom-in-95 duration-200"
        style={{
          width: `min(${width}px, calc(100vw - 32px))`,
          boxShadow: "var(--shadow-3)",
          outline: "none",
        }}
      >
        <div className="dp-modal-head">
          {icon && (
            <div
              className="empty-ico"
              style={{ width: 40, height: 40, marginBottom: 0, borderRadius: "var(--r-sm)", flex: "0 0 auto" }}
            >
              <Icon name={icon} size={19} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="disp" style={{ fontSize: 19 }}>
              {title}
            </div>
            {sub && (
              <div className="muted" style={{ fontSize: 12.8, marginTop: 2 }}>
                {sub}
              </div>
            )}
          </div>
          <button
            type="button"
            className="icon-btn"
            style={{ border: 0, width: 28, height: 28, flex: "0 0 auto" }}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="dp-modal-body">{children}</div>

        {footer && <div className="dp-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
