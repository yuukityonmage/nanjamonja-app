import React from "react"
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

export default () => {
  const { width, height } = useWindowSize()
  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={true}
      />
      <h1>結果発表</h1>
    </>
  )
}
