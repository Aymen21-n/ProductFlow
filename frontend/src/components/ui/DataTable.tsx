import type { ReactNode } from 'react'
import styles from './DataTable.module.css'

export interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
}

const SKELETON_ROW_COUNT = 4

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return <span className={styles.placeholder}>-</span>
  }

  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }

  return String(value)
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnee disponible.',
}: DataTableProps<T>) {
  const columnCount = Math.max(columns.length, 1)

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key]

    if (column.render) {
      return column.render(value, row)
    }

    return formatValue(value)
  }

  const getRowKey = (row: T, rowIndex: number) => {
    const maybeId = row.id

    if (typeof maybeId === 'string' || typeof maybeId === 'number') {
      return String(maybeId)
    }

    return `row-${rowIndex}`
  }

  return (
    <div className={styles.wrapper} aria-busy={loading}>
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={styles.headerCell}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={styles.body}>
          {loading &&
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <tr
                key={`skeleton-${rowIndex}`}
                className={`${styles.row} ${rowIndex % 2 === 1 ? styles.rowAlt : ''}`}
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={`${String(column.key)}-${rowIndex}`}
                    className={styles.cell}
                  >
                    <span
                      className={styles.skeleton}
                      style={{ width: `${56 + ((rowIndex + columnIndex) % 3) * 14}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}

          {!loading && data.length === 0 && (
            <tr className={styles.emptyRow}>
              <td className={styles.emptyCell} colSpan={columnCount}>
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className={`${styles.row} ${rowIndex % 2 === 1 ? styles.rowAlt : ''}`}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={styles.cell}>
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
