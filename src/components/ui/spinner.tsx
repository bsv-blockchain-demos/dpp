export const Spinner = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeClass = size === "sm" ? "sm" : size === "lg" ? "lg" : "";
  return (
    <div
      className={`spinner ${sizeClass} ${className}`.trim()}
      role="status"
      aria-label="Loading"
    />
  );
};
