import { useState, useEffect } from 'react'

export default function Typewriter({
  text,
  speed = 100,
  deleteSpeed = 50,
  startDelay = 0,
  pauseAfterType = 1200,
  pauseAfterDelete = 400,
  loop = true,
  showCursor = true,
  cursorColor = '#2474C0',
  className = '',
}) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let timeoutId
    let cancelled = false

    const type = (i) => {
      if (cancelled) return
      setDisplayed(text.slice(0, i))
      if (i < text.length) {
        timeoutId = setTimeout(() => type(i + 1), speed)
      } else {
        timeoutId = setTimeout(() => {
          if (loop) del(text.length)
        }, pauseAfterType)
      }
    }

    const del = (i) => {
      if (cancelled) return
      setDisplayed(text.slice(0, i))
      if (i > 0) {
        timeoutId = setTimeout(() => del(i - 1), deleteSpeed)
      } else {
        timeoutId = setTimeout(() => type(0), pauseAfterDelete)
      }
    }

    timeoutId = setTimeout(() => type(0), startDelay)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [text, speed, deleteSpeed, startDelay, pauseAfterType, pauseAfterDelete, loop])

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'flex-start',
        height: '1.6em',
      }}
    >
      {showCursor && (
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '0.4em',
            height: '1.6em',
            marginRight: '10px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              bottom: '0em',
              right: '-45%',
              transform: 'translateX(-50%)',
              width: '0.16em',
              height: '1.5em',
              backgroundColor: cursorColor,
              borderRadius: '999px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: -20,
              right: '-105%',
              transform: 'translateX(-50%)',
              width: '0.4em',
              height: '0.4em',
              backgroundColor: cursorColor,
              borderRadius: '50%',
            }}
          />
        </span>
      )}

      <span
        style={{
          backgroundColor: 'rgba(36, 116, 192, 0.15)',
          padding: '4px 16px',
          borderRadius: '8px',
          height: '1.5em',
          display: 'inline-flex',
          alignItems: 'center',
          overflow: 'visible',
        }}
      >
        {displayed}
      </span>

      {showCursor && (
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '0.4em',
            height: '1.6em',
            marginLeft: '10px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '0em',
              left: '-5%',
              transform: 'translateX(-50%)',
              width: '0.16em',
              height: '1.5em',
              backgroundColor: cursorColor,
              borderRadius: '999px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: -20,
              left: '-5%',
              transform: 'translateX(-50%)',
              width: '0.4em',
              height: '0.4em',
              backgroundColor: cursorColor,
              borderRadius: '50%',
            }}
          />
        </span>
      )}
    </span>
  )
}