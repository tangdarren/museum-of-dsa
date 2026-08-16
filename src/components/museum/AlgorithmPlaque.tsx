import type { AlgorithmDefinition } from '../../types/algorithm'

type AlgorithmPlaqueProps = {
  algorithm: AlgorithmDefinition
}

function AlgorithmPlaque({ algorithm }: AlgorithmPlaqueProps) {
  return (
    <aside className="algorithm-plaque" aria-label={`${algorithm.title} plaque`}>
      <p className="algorithm-plaque-category">{algorithm.category}</p>
      <h2>{algorithm.title}</h2>
      <p className="algorithm-plaque-description">{algorithm.shortDescription}</p>
      <div className="algorithm-plaque-complexity">
        <p>
          <span>Time</span>
          {algorithm.complexity.time}
        </p>
        <p>
          <span>Space</span>
          {algorithm.complexity.space}
        </p>
      </div>
      <h3>What you'll explore</h3>
      <ul>
        {algorithm.explore.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}

export default AlgorithmPlaque
