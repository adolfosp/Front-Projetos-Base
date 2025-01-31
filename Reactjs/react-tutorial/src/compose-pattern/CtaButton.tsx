import { Cta } from "./CtaRoot";

export function Button() {
  return (
    <Cta.Root>
      <Cta.Icon name="+" color="red" size={20} />
      <Cta.Text>Add more</Cta.Text>
    </Cta.Root>
  );
}
