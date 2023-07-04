type Props = {
  items: {
    url: string;
    label: string;
  }[];
};

export function Breadcrumb({
  items,
}: Props) {
  const itemsWithHome = [
    {
      url: "/",
      label: "Gigscore",
    },
    ...items
  ];

  return (
    <nav aria-label="Breadcrumb" class="breadcrumbs">
      <ol>
        {itemsWithHome.map((item) => (
          <li key={item.url}>
            <a href={item.url}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
