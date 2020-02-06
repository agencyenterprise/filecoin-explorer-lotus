export const apply_engine_parameters = (engine) => {
  switch (engine.layoutAlgorithm()) {
    case 'd3v4-force':
      engine
        .collisionRadius(25)
        .gravityStrength(0.05)
        .initialCharge(-500)
      break
    case 'd3-force':
      engine.gravityStrength(0.1).initialCharge(-1000)
      break
    default:
      // to nothing
      break
  }

  return engine
}
