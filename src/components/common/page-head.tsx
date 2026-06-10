import { Icon, type IconName } from "./icon";

export function PageHead({
  eyebrow,
  eyebrowIcon,
  title,
  sub,
  right,
}: {
  eyebrow?: string;
  eyebrowIcon?: IconName;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 20,
        marginBottom: 26,
        flexWrap: "wrap",
      }}
    >
      <div>
        {eyebrow && (
          <span className="eyebrow">
            {eyebrowIcon && <Icon name={eyebrowIcon} size={14} />}
            {eyebrow}
          </span>
        )}
        <h1
          className="disp"
          style={{ fontSize: 30, margin: eyebrow ? "12px 0 0" : 0 }}
        >
          {title}
        </h1>
        {sub && (
          <p
            className="muted"
            style={{ fontSize: 14.5, margin: "7px 0 0", maxWidth: 540, lineHeight: 1.5 }}
          >
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
