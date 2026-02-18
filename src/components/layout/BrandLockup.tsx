type BrandLockupProps = {
  iconSize?: number;
};

export default function BrandLockup({ iconSize = 40 }: BrandLockupProps) {
  const style = {
    ['--icon-size' as string]: `${iconSize}px`,
  };

  return (
    <div className="flex items-center" style={style} aria-label="Remí">
      <div className="relative h-[var(--icon-size)] w-[var(--icon-size)] shrink-0 overflow-hidden rounded-[12%]">
        <img
          src="/logo.png"
          alt="Ícone Remí"
          className="absolute left-1/2 top-1/2 h-auto w-[calc(var(--icon-size)*2.85)] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="ml-[calc(var(--icon-size)*0.06)] leading-none flex items-center h-[var(--icon-size)]">
        <span
          className="block text-[#111827]"
          style={{
            fontFamily: 'Futura, "Futura PT", "Avenir Next", "Century Gothic", sans-serif',
            fontWeight: 700,
            fontSize: 'calc(var(--icon-size)*0.46)',
            letterSpacing: '0.02em',
          }}
        >
          Remí
        </span>
      </div>
    </div>
  );
}
