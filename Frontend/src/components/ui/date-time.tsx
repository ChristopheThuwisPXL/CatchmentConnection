import { useState, useEffect } from "react"

export default function DateTime() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
        {time.toLocaleTimeString()}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {time.toLocaleDateString()}
      </div>
    </div>
  )
}