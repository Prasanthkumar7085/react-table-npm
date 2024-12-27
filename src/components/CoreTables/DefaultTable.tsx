import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useState } from "react";
import { getWidth, SortItems } from "../../lib/helpers/tableHelpers";
import "../scss/app.scss";
interface pagePropsAll {
  columns: any[];
  data: any[];
  tableFooterData?: any;
  loading: boolean;

  removeSortingForColumnIds?: any;
  customSorting: boolean;
  sortingIcons: any[];
  noDataImage?: string;
}

interface pagePropsWithSearchParams {
  searchParams: any;
  getData: any;
}

interface pagePropsWithoutSearchParams {
  searchParams?: never;
  getData?: never;
}

type pagePropsGetData =
  | pagePropsWithSearchParams
  | pagePropsWithoutSearchParams;

type pageProps = pagePropsAll & pagePropsGetData;

const DefaultTable: FC<pageProps> = ({
  columns,
  data,
  tableFooterData,
  loading,
  searchParams,
  getData,
  removeSortingForColumnIds,
  customSorting,
  sortingIcons,
  noDataImage,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const sortAndGetData = (header: any) => {
    if (removeSortingForColumnIds.includes(header.id)) {
      return;
    }
    if (header.id == "select_rows" || header.id == "actions") {
      return;
    }
    let orderBy = header.id;
    let orderType = "asc";
    if ((searchParams?.order_by as string) == header.id) {
      if (searchParams?.order_type == "asc") {
        orderType = "desc";
      } else {
        orderBy = "";
        orderType = "";
      }
    }

    getData({
      orderBy: orderBy,
      orderType: orderType,
    });
  };

  return (
    <div
      className="tableContainer"
      style={{ width: "100%", overflowX: "auto" }}
    >
      <table style={{ width: "100%" }}>
        <thead
          className="thead"
          style={{
            height: "32px",
            position: "sticky",
            top: "0px",
            zIndex: "2",

            color: "white",
          }}
        >
          {table.getHeaderGroups().map((headerGroup: any) => (
            <tr className="table-row" key={headerGroup.id}>
              {headerGroup.headers.map((header: any, index: number) => {
                if (customSorting) {
                  return (
                    <th
                      className="cell"
                      key={index}
                      colSpan={header.colSpan}
                      style={{
                        minWidth: getWidth(header.id, columns),
                        width: getWidth(header.id, columns),
                        color: "#000",
                        background: "#F0EDFF",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={() => sortAndGetData(header)}
                          style={{
                            display: "flex",
                            gap: "10px",
                            cursor: "pointer",
                            minWidth: getWidth(header.id, columns),
                            width: getWidth(header.id, columns),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          <SortItems
                            searchParams={searchParams}
                            header={header}
                            removeSortingForColumnIds={
                              removeSortingForColumnIds
                            }
                            sortingIcons={sortingIcons}
                          />
                        </div>
                      )}
                    </th>
                  );
                } else {
                  return (
                    <th
                      className="cell"
                      key={index}
                      colSpan={header.colSpan}
                      style={{
                        minWidth: getWidth(header.id, columns),
                        width: getWidth(header.id, columns),
                        color: "#000",
                        background: "#F0EDFF",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                          style={{
                            display: "flex",
                            gap: "10px",
                            cursor: "pointer",
                            minWidth: getWidth(header.id, columns),
                            width: getWidth(header.id, columns),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <img
                                src={sortingIcons?.[0] || "/sort/sort-asc.svg"}
                                height={8}
                                width={8}
                                alt="image"
                                style={{
                                  display:
                                    removeSortingForColumnIds?.includes(
                                      header.id
                                    ) || header.colSpan == 2
                                      ? "none"
                                      : "",
                                }}
                              />
                            ),
                            desc: (
                              <img
                                src={sortingIcons?.[1] || "/sort/sort-desc.svg"}
                                height={8}
                                width={8}
                                alt="image"
                                style={{
                                  display:
                                    removeSortingForColumnIds?.includes(
                                      header.id
                                    ) || header.colSpan == 2
                                      ? "none"
                                      : "",
                                }}
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <img
                              src={sortingIcons?.[2] || "/sort/un-sort.svg"}
                              height={8}
                              width={8}
                              alt="Unsorted"
                              style={{
                                display:
                                  removeSortingForColumnIds?.includes(
                                    header.id
                                  ) || header.colSpan == 2
                                    ? "none"
                                    : "",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </th>
                  );
                }
              })}
            </tr>
          ))}
        </thead>
        <tbody className="tbody">
          {data?.length ? (
            customSorting ? (
              table.getRowModel().rows.map((row: any, mainIndex: number) => {
                return (
                  <tr className="table-row" key={mainIndex}>
                    {row.getVisibleCells().map((cell: any, index: number) => {
                      return (
                        <td
                          className="cell"
                          key={index}
                          style={{
                            width: "100%",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              table.getRowModel().rows.map((row: any, mainIndex: number) => {
                return (
                  <tr className="table-row" key={mainIndex}>
                    {row.getVisibleCells().map((cell: any, index: number) => {
                      return (
                        <td
                          className="cell"
                          key={index}
                          style={{
                            width: "100%",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )
          ) : !loading ? (
            <tr>
              <td colSpan={10}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40vh",
                  }}
                >
                  <img
                    src={noDataImage || "/NoData.svg"}
                    alt=""
                    height={150}
                    width={250}
                  />
                </div>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={10}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40vh",
                  }}
                ></div>
              </td>
            </tr>
          )}
        </tbody>
        {tableFooterData?.length ? (
          <tfoot
            className="tfootRow"
            style={{
              fontSize: "clamp(12px, 0.62vw, 14px)",
              border: "1px solid #a5a5a5",
              textTransform: "uppercase",
              fontWeight: "600",
              color: "#1B2459",
            }}
          >
            {tableFooterData?.map((footerData: any, footerIndex: number) => (
              <tr className="radiusLastChild" key={footerIndex}>
                {footerData?.map((item: any, index: number) => {
                  return (
                    <td key={index} className="cell">
                      {item}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        ) : (
          ""
        )}
      </table>
    </div>
  );
};
export default DefaultTable;
