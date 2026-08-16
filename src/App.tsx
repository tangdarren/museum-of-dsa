import { Canvas } from '@react-three/fiber'
import MuseumScene from './scenes/MuseumScene'

function App() {
  return (
    <Canvas shadows>
      <MuseumScene />
    </Canvas>
  )
}

export default App
