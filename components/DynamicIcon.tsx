import * as Icons from "@mui/icons-material";

export default function DynamicIcon({ name }: { name: string }) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.SvgIconComponent | null;
  return <>{Icon && <Icon />}</>;
}
