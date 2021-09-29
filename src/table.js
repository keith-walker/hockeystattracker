import React, { useMemo } from "react";
import { useTable } from "react-table";

export const BasicTable = () => {
  const data = useMemo(
    () => [
      {
        name: "Ayaan",
        age: 26,
      },
      {
        name: "Ahana",
        age: 22,
      },
      {
        name: "Peter",
        age: 40,
      },
      {
        name: "Virat",
        age: 30,
      },
      {
        name: "Rohit",
        age: 32,
      },
      {
        name: "Dhoni",
        age: 37,
      },
    ],
    []
  );

  //useMemo makes sure it doesn't recalculate everytime something is loaded
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Age",
        accessor: "age",
      },
    ],
    []
  );

  const tableInstance = useTable({
    columns: columns,
    data: data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
