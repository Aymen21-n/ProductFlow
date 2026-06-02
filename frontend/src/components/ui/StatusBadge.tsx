import styles from './StatusBadge.module.css'

export interface StatusBadgeProps {
  statut: 'en_attente' | 'approuvee' | 'refusee'
}

const statusConfig = {
  en_attente: {
    label: 'En attente',
    className: styles.pending,
  },
  approuvee: {
    label: 'Approuvée',
    className: styles.approved,
  },
  refusee: {
    label: 'Refusée',
    className: styles.refused,
  },
} satisfies Record<StatusBadgeProps['statut'], { label: string; className: string }>

function StatusBadge({ statut }: StatusBadgeProps) {
  const { label, className } = statusConfig[statut]

  return (
    <span className={`${styles.badge} ${className}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}

export default StatusBadge
