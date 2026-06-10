import {
  ShieldCheck,
  Lock,
  LockOpen,
  Send,
  Copy,
  TriangleAlert,
  Info,
  CircleHelp,
  ArrowRight,
  Link as LinkIcon,
  RefreshCw,
  Check,
  CircleCheck,
  Package,
  Layers,
  Search,
  Inbox,
  X,
  Plus,
  Trash2,
  Upload,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  KeyRound,
  LogOut,
  Sun,
  Moon,
  ScrollText,
  Fingerprint,
  Boxes,
  GitBranch,
  BookText,
  Eye,
  Clock,
  Zap,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

/**
 * Single lucide icon wrapper for the whole app. Names mirror the design
 * spec's kebab-case set so surfaces can request icons by string (incl.
 * dynamic lookups in steppers / chips / stage badges). Retires all emoji.
 */
const ICONS = {
  "shield-check": ShieldCheck,
  lock: Lock,
  unlock: LockOpen,
  send: Send,
  copy: Copy,
  "alert-triangle": TriangleAlert,
  info: Info,
  "circle-help": CircleHelp,
  "arrow-right": ArrowRight,
  link: LinkIcon,
  refresh: RefreshCw,
  check: Check,
  "check-circle": CircleCheck,
  package: Package,
  layers: Layers,
  search: Search,
  inbox: Inbox,
  x: X,
  plus: Plus,
  trash: Trash2,
  upload: Upload,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "corner-down-right": CornerDownRight,
  "key-round": KeyRound,
  "log-out": LogOut,
  sun: Sun,
  moon: Moon,
  "scroll-text": ScrollText,
  fingerprint: Fingerprint,
  boxes: Boxes,
  "git-branch": GitBranch,
  github: BookText, // brand icon retired from lucide; README/repo affordance
  eye: Eye,
  clock: Clock,
  zap: Zap,
  "external-link": ExternalLink,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Cmp = ICONS[name];
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
