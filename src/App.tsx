import { useState } from 'react'
import { LCU } from './LCU.ts'

function App() {
  const [name, setName] = useState('')

  const lcu = new LCU()

  lcu
    .request('GET', '/lol-summoner/v1/current-summoner', {})
    .then((res) => {
      setName(JSON.stringify(res))
    })
    .catch((error) => {
      setName(`error: ${JSON.stringify(error)}`)
    })

  return <p>{name} </p>
}

export default App
