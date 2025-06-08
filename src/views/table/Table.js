import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function AppGrid({
  gridName,
  keyField,
  rows,
  columns,
  expandRow,
  onExpand,
  disablePagination,
  onTableChange,
  defaultSorted,
  filterModel,
}) {
  return (
    <BootstrapTable
      name={gridName}
      keyField={keyField}
      data={rows}
      columns={columns}
    //   bootstrap4
      bordered={false}
      hover
      condensed
      expandRow={expandRow}
      onExpand={onExpand}
    //   remote={{
    //     sort: disablePagination ? false : true,
    //     pagination: disablePagination ? false : true,
    //   }}
    //   onTableChange={onTableChange}
    //   defaultSorted={defaultSorted}
    //   page={
    //     disablePagination ? false : currentPage
    //   }
    //   sizePerPage={
    //     disablePagination ? false : itemsPerPage
    //   }
    //   totalSize={
    //     disablePagination ? false : maxSize
    //   }
    //   pagination={
    //     disablePagination
    //       ? false
    //       : paginationFactory({
    //           page: currentPage,
    //           sizePerPage: itemsPerPage,
    //           totalSize: totalItems,
    //           nextPageText: "Next",
    //           prePageText: "Prev",
    //           alwaysShowAllBtns: true,
    //           withFirstAndLast: false,
    //         })
    //   }
    />
  );
}

export default AppGrid;
