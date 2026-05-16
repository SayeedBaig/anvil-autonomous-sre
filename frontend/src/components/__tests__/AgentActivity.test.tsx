import { render, screen } from '@testing-library/react'
import AgentActivity from '@/components/AgentActivity'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Terminal: () => <div data-testid="terminal-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  Database: () => <div data-testid="database-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Cpu: () => <div data-testid="cpu-icon" />,
  Workflow: () => <div data-testid="workflow-icon" />,
}))

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn()

describe('AgentActivity Component', () => {
  const mockThoughts = [
    {
      agent: 'MonitoringAgent',
      content: 'Anomaly detected in checkout-service.',
      timestamp: Date.now() / 1000
    },
    {
      agent: 'ContextAgent',
      content: 'Historical match found with 94% confidence.',
      timestamp: Date.now() / 1000
    }
  ]

  it('renders the agent feed correctly', () => {
    render(<AgentActivity thoughts={mockThoughts} />)
    
    expect(screen.getByText('Anomaly detected in checkout-service.')).toBeInTheDocument()
    expect(screen.getByText('Historical match found with 94% confidence.')).toBeInTheDocument()
    expect(screen.getByText('[MONITORING]')).toBeInTheDocument()
    expect(screen.getByText('[CONTEXT]')).toBeInTheDocument()
  })

  it('displays the pulsing cursor for the active agent', () => {
    render(<AgentActivity thoughts={mockThoughts} />)
    const cursors = document.querySelectorAll('.cursor-blink')
    expect(cursors.length).toBe(1)
  })

  it('renders empty state when no thoughts are provided', () => {
    render(<AgentActivity thoughts={[]} />)
    expect(screen.getByText(/Listening for infrastructure events/i)).toBeInTheDocument()
  })
})
