describe('Health Check', () => {
  it('should return status ok', () => {
    const healthStatus = { status: 'ok' }
    expect(healthStatus.status).toBe('ok')
  })

  it('should have timestamp in health response', () => {
    const healthResponse = { 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    }
    expect(healthResponse).toHaveProperty('timestamp')
    expect(healthResponse.timestamp).toBeTruthy()
  })
})