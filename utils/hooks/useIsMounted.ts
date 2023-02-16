import { useEffect, useState } from 'react'

function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

export default useIsMounted
