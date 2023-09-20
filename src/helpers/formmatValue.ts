export function formatValue(value: number) {
  const convertedValue = (value / 100).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return convertedValue;
}
