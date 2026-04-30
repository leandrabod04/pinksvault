import './StarRating.css'

/**
 * StarRating — interactive or display-only star picker.
 *
 * Props:
 *   value    {number}   current rating (1–5)
 *   onChange {function} called with new value when a star is clicked (omit for readOnly)
 *   readOnly {boolean}  renders non-interactive display stars (default false)
 *   size     {string}   'sm' | 'md' (default 'md')
 */
export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  return (
    <div className={`star-rating star-rating--${size}${readOnly ? ' star-rating--readonly' : ''}`}
         role={readOnly ? undefined : 'group'}
         aria-label={readOnly ? `${value} out of 5 stars` : 'Select a star rating'}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star${star <= value ? ' star--filled' : ''}`}
          onClick={readOnly ? undefined : () => onChange(star)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          disabled={readOnly}
          tabIndex={readOnly ? -1 : 0}
        >
          {star <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}
