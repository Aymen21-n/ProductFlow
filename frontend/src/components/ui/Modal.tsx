import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import styles from './Modal.module.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const ANIMATION_DURATION_MS = 220

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const titleId = useId()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null
      setIsRendered(true)

      const frame = window.requestAnimationFrame(() => {
        setIsVisible(true)
      })

      return () => {
        window.cancelAnimationFrame(frame)
      }
    }

    setIsVisible(false)
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsRendered(false)
    }, ANIMATION_DURATION_MS)

    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isRendered) {
      previousActiveElementRef.current?.focus()
      return
    }

    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    const focusableElements = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    const firstFocusableElement = focusableElements[0]

    if (firstFocusableElement) {
      firstFocusableElement.focus()
    } else {
      dialog.focus()
    }
  }, [isRendered])

  useEffect(() => {
    if (!isRendered) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const dialog = dialogRef.current
      if (!dialog) {
        return
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstFocusableElement = focusableElements[0]
      const lastFocusableElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
      } else if (!event.shiftKey && activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isRendered, onClose])

  useEffect(() => {
    if (!isRendered) {
      return
    }

    const { body } = document
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousOverflow
    }
  }, [isRendered])

  if (!isRendered) {
    return null
  }

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose()
    }
  }

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${isVisible ? styles.overlayVisible : styles.overlayHidden}`}
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        className={`${styles.modal} ${isVisible ? styles.modalVisible : styles.modalHidden}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer la fenetre modale"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
