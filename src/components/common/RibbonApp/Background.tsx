export function RibbonAppBackground({ src }: RibbonAppBackground.Props) {
  return (
    <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-10% from-tui-dark to-30% to-transparent">
      <img className="relative z-[-1] size-full object-cover" src={src} />
    </div>
  );
}

export namespace RibbonAppBackground {
  export type Props = {
    src: string;
  };
}
