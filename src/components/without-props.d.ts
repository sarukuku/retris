export type WithoutProps<Props, UnneededProps> = Pick<
  Props,
  Exclude<keyof Props, keyof UnneededProps>
>
