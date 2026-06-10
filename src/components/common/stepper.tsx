import { Fragment } from "react";
import { Icon, type IconName } from "./icon";

const STEPS: [string, IconName][] = [
  ["Create", "plus"],
  ["Add stages", "layers"],
  ["Hand off", "send"],
  ["Finalize", "check-circle"],
];

/** Horizontal journey stepper: create → add → hand off → finalize. */
export function Stepper({ current = 0 }: { current?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {STEPS.map(([label, icon], i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Fragment key={label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                opacity: done || active ? 1 : 0.55,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  flex: "0 0 auto",
                  background: done
                    ? "var(--accent)"
                    : active
                      ? "var(--accent-soft)"
                      : "var(--surface-2)",
                  color: done
                    ? "var(--accent-ink)"
                    : active
                      ? "var(--accent)"
                      : "var(--ink-3)",
                  border: active
                    ? "1.5px solid var(--accent)"
                    : "1px solid var(--line)",
                }}
              >
                {done ? <Icon name="check" size={14} /> : <Icon name={icon} size={14} />}
              </span>
              <span
                className="max-sm:hidden"
                style={{
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active || done ? "var(--ink)" : "var(--ink-3)",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1.5,
                  margin: "0 12px",
                  background: i < current ? "var(--accent)" : "var(--line-2)",
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
