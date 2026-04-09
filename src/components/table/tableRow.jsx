// TableRow.js
import React from "react";

function TableRow({ rowData, columns, actions }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      {columns.map((col) => (
        <td key={col.key} className="px-4 py-2">
          {col.render ? (
            col.render(rowData[col.key], rowData)
          ) : col.key === "statut" ? (
            <span
              className={`px-2 py-1 text-xs rounded ${
                rowData[col.key] === "Actif"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {rowData[col.key]}
            </span>
          ) : (
            rowData[col.key]
          )}
        </td>
      ))}

      {actions && (
        <td className="px-4 py-2 flex gap-2">
          {actions.map((action) => (
            <button
              key={action.label || action.title}
              onClick={() => (action.onClick || action.callback)(rowData)}
              className={`px-3 py-1 text-white rounded ${
                action.color || "bg-blue-600"
              }`}
            >
              {action.icon || action.label}
            </button>
          ))}
        </td>
      )}
    </tr>
  );
}

export default TableRow;