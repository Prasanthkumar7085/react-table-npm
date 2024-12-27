export const SortItems = ({
  searchParams,
  header,
  removeSortingForColumnIds,
  sortingIcons,
}: {
  searchParams: any;
  header: any;
  removeSortingForColumnIds: any;
  sortingIcons: any;
}) => {
  return (
    <div>
      {searchParams?.order_by == header?.id ? (
        searchParams?.order_type == "asc" ? (
          <img
            src={sortingIcons?.[0] || "/sort/sort-asc.svg"}
            height={8}
            width={8}
            style={{
              display: removeSortingForColumnIds?.includes(header.id)
                ? "none"
                : "",
            }}
            alt="image"
          />
        ) : (
          <img
            src={sortingIcons?.[1] || "/sort/sort-desc.svg"}
            height={8}
            width={8}
            style={{
              display: removeSortingForColumnIds?.includes(header.id)
                ? "none"
                : "",
            }}
            alt="image"
          />
        )
      ) : removeSortingForColumnIds?.includes(header.id) ? (
        ""
      ) : (
        <img
          src={sortingIcons?.[2] || "/sort/un-sort.svg"}
          height={8}
          width={8}
          alt="image"
        />
      )}
    </div>
  );
};

export const getWidth = (id: string, columns: any) => {
  const widthObj = findObjectById(columns, id);

  if (widthObj) {
    const width = widthObj?.width;
    return width;
  } else return "100px";
};

function findObjectById(array: any[], id: string) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (typeof element === "object" && element.id === id) {
      return element;
    }
    if (Array.isArray(element)) {
      const foundObject: any = findObjectById(element, id);
      if (foundObject) {
        return foundObject;
      }
    }
  }
  return null;
}
