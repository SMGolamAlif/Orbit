import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Edit2, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useAccent } from '@/hooks/useAccent'
import { useFocusTimer } from '@/hooks/useFocusTimer'

interface EditState {
  focusMinutes: number
  breakMinutes: number
}

function UltraFocusTimer() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { theme } = useTheme()
  const { colors } = useAccent()
  const {
    secondsLeft,
    focusMinutes,
    breakMinutes,
    mode,
    running,
    setDurations,
    toggleRunning,
    milliseconds,
  } = useFocusTimer()

  const [isStopwatch, setIsStopwatch] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editState, setEditState] = useState<EditState>({
    focusMinutes,
    breakMinutes,
  })
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0)
  const stopwatchRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const showMs = profile?.showMilliseconds !== false

  // Fullscreen effect
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } catch (err) {
        console.warn('Fullscreen request failed:', err)
      }
    }

    enterFullscreen()

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
          // Ignore errors on exit
        })
      }
    }
  }, [])

  // Stopwatch effect
  useEffect(() => {
    if (!isStopwatch) return

    if (running) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current)
    }

    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current)
    }
  }, [running, isStopwatch])

  const formatTime = (totalSeconds: number, showMillis = false, ms = 0) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const base = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    if (!showMillis) return { main: base, ms: '' }
    return { main: base, ms: `.${ms.toString().padStart(3, '0')}` }
  }

  const getDisplayTime = () => {
    if (isStopwatch) {
      return formatTime(stopwatchSeconds, showMs, milliseconds)
    }
    return formatTime(secondsLeft, showMs, milliseconds)
  }

  const displayTime = getDisplayTime()

  const handleSwitchToStopwatch = () => {
    setIsStopwatch(!isStopwatch)
    if (!isStopwatch) {
      setStopwatchSeconds(0)
    }
  }

  const handleEditSubmit = () => {
    setDurations(editState.focusMinutes, editState.breakMinutes)
    setShowEditDialog(false)
  }

  const primaryRGB = colors.primary
  const secondaryRGB = colors.secondary
  const bgColor = theme === 'dark' ? '#000000' : '#FFFFFF'
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000'
  const subTextColor = theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
  const buttonBgColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const buttonHoverColor = theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
  const primaryColor = `rgb(${primaryRGB})`
  const secondaryColor = `rgb(${secondaryRGB})`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'background-color 0.2s ease',
      }}
    >
      {/* Top Controls */}
      <button
        type="button"
        onClick={() => navigate('/app/focus-timer')}
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: buttonBgColor,
          color: textColor,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = buttonHoverColor
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = buttonBgColor
        }}
        aria-label="Exit ultra focus mode"
      >
        <X size={24} strokeWidth={2} />
      </button>

      {/* Main Timer Display */}
      <div
        style={{
          marginBottom: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {/* Digital Timer */}
        <div
          style={{
            fontFamily:
              '"IBM Plex Mono", "Space Mono", "SF Mono", Monaco, "Cascadia Mono", monospace',
            fontSize: '140px',
            fontWeight: 900,
            letterSpacing: '-3px',
            lineHeight: '1',
            color: textColor,
            textShadow:
              theme === 'dark'
                ? `0 0 40px rgba(${primaryRGB}, 0.3)`
                : `0 0 20px rgba(${primaryRGB}, 0.2)`,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span>{displayTime.main}</span>
          {displayTime.ms && (
            <span
              style={{
                fontSize: '70px',
                color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                marginLeft: '8px',
              }}
            >
              {displayTime.ms}
            </span>
          )}
        </div>

        {/* Status Text */}
        {!isStopwatch && (
          <p
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: subTextColor,
            }}
          >
            {mode === 'focus' ? 'Focus Time' : 'Break Time'}
          </p>
        )}
        {isStopwatch && (
          <p
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: subTextColor,
            }}
          >
            Stopwatch
          </p>
        )}
      </div>

      {/* Bottom Controls */}
      <div
        style={{
          position: 'fixed',
          bottom: '48px',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
        }}
      >
        {/* Edit Button */}
        <button
          type="button"
          onClick={() => setShowEditDialog(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: buttonBgColor,
            color: textColor,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverColor
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonBgColor
          }}
          aria-label="Edit timer"
        >
          <Edit2 size={24} strokeWidth={2} />
        </button>

        {/* Play/Pause - Main Control */}
        <button
          type="button"
          onClick={toggleRunning}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 20px 40px rgba(${primaryRGB}, 0.3)`,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          aria-label={running ? 'Pause' : 'Start'}
        >
          {running ? (
            <div style={{ display: 'flex', gap: '4px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'white',
                  borderRadius: '2px',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'white',
                  borderRadius: '2px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid white',
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                marginLeft: '4px',
              }}
            />
          )}
        </button>

        {/* Stopwatch Toggle Button */}
        <button
          type="button"
          onClick={handleSwitchToStopwatch}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isStopwatch ? primaryColor : buttonBgColor,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isStopwatch) {
              e.currentTarget.style.backgroundColor = buttonHoverColor
            }
          }}
          onMouseLeave={(e) => {
            if (!isStopwatch) {
              e.currentTarget.style.backgroundColor = buttonBgColor
            }
          }}
          aria-label="Switch to stopwatch"
        >
          <Clock size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Edit Dialog */}
      {showEditDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '400px',
              borderRadius: '20px',
              background:
                theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
              padding: '40px 32px',
              backdropFilter: 'blur(12px)',
              border:
                theme === 'dark'
                  ? '1px solid rgba(255,255,255,0.2)'
                  : '1px solid rgba(0,0,0,0.2)',
            }}
          >
            <h2
              style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 600,
                color: textColor,
              }}
            >
              Set Timer Duration
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                  }}
                >
                  Focus Time (minutes)
                </span>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={editState.focusMinutes}
                  onChange={(e) =>
                    setEditState((prev) => ({
                      ...prev,
                      focusMinutes: Math.max(1, Number(e.target.value)),
                    }))
                  }
                  style={{
                    borderRadius: '8px',
                    border:
                      theme === 'dark'
                        ? '1px solid rgba(255,255,255,0.2)'
                        : '1px solid rgba(0,0,0,0.2)',
                    backgroundColor:
                      theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    padding: '8px 16px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontFamily: '"IBM Plex Mono", "Space Mono", monospace',
                    color: textColor,
                    outline: 'none',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primaryColor
                    e.currentTarget.style.backgroundColor =
                      theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                    e.currentTarget.style.backgroundColor =
                      theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                  }}
                >
                  Break Time (minutes)
                </span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={editState.breakMinutes}
                  onChange={(e) =>
                    setEditState((prev) => ({
                      ...prev,
                      breakMinutes: Math.max(1, Number(e.target.value)),
                    }))
                  }
                  style={{
                    borderRadius: '8px',
                    border:
                      theme === 'dark'
                        ? '1px solid rgba(255,255,255,0.2)'
                        : '1px solid rgba(0,0,0,0.2)',
                    backgroundColor:
                      theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    padding: '8px 16px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontFamily: '"IBM Plex Mono", "Space Mono", monospace',
                    color: textColor,
                    outline: 'none',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primaryColor
                    e.currentTarget.style.backgroundColor =
                      theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                    e.currentTarget.style.backgroundColor =
                      theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }}
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowEditDialog(false)}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  border:
                    theme === 'dark'
                      ? '1px solid rgba(255,255,255,0.2)'
                      : '1px solid rgba(0,0,0,0.2)',
                  backgroundColor:
                    theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  padding: '8px 16px',
                  color: textColor,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  padding: '8px 16px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  boxShadow: `0 8px 20px rgba(${primaryRGB}, 0.3)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 30px rgba(${primaryRGB}, 0.5)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 20px rgba(${primaryRGB}, 0.3)`
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)'
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { UltraFocusTimer }
