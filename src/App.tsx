import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { Card, CardHeader, Divider } from '@nextui-org/react'

function App() {
  const [name, setName] = useState('')

  async function auth() {
    try {
      const a = await invoke('authenticate')
      console.log(a)
      setName(JSON.stringify(a))
    } catch (e) {
      setName(`${e}`)
    }
  }

  auth()

  return (
    <Card>
      <CardHeader>{name}</CardHeader>
      <Divider />
    </Card>
  )
}

export default App
