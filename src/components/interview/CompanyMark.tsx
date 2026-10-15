export default function CompanyMark({ name, gradient, size = 48 }: { name: string; gradient: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      className={`grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} font-bold text-white shadow-lg`}
    >
      {name[0]}
    </div>
  );
}