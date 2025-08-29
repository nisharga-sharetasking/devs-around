import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /DevsAround/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the welcome text', () => {
    render(<Home />)
    const welcomeText = screen.getByText(/Welcome to the monorepo application/i)
    expect(welcomeText).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    const { container } = render(<Home />)
    const main = container.querySelector('main')
    expect(main).toHaveClass('min-h-screen')
    expect(main).toHaveClass('flex')
    expect(main).toHaveClass('flex-col')
  })
})
