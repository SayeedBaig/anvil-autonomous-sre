import { render, screen } from '@testing-library/react'
import DeploymentIntelligence from '@/components/DeploymentIntelligence'

describe('DeploymentIntelligence Component', () => {
  it('renders correctly in healthy status', () => {
    render(<DeploymentIntelligence status="healthy" />)
    expect(screen.getByText('v2.1.3-stable')).toBeInTheDocument()
    expect(screen.getByText(/Steady State/i)).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument() // Risk score
    expect(screen.getByText('NOMINAL')).toBeInTheDocument()
  })

  it('renders correctly in incident status', () => {
    render(<DeploymentIntelligence status="incident" />)
    expect(screen.getByText('v2.1.4-hotfix')).toBeInTheDocument()
    expect(screen.getByText(/Active Canary/i)).toBeInTheDocument()
    expect(screen.getByText('82')).toBeInTheDocument() // Risk score
    expect(screen.getByText('HIGH RISK')).toBeInTheDocument()
  })

  it('displays intelligence items', () => {
    render(<DeploymentIntelligence status="healthy" />)
    expect(screen.getByText('Traffic Shift')).toBeInTheDocument()
    expect(screen.getByText('Anomaly Delta')).toBeInTheDocument()
    expect(screen.getByText('Security Audit')).toBeInTheDocument()
    expect(screen.getByText('PASSED')).toBeInTheDocument()
  })

  it('renders the view deployment graph button', () => {
    render(<DeploymentIntelligence status="healthy" />)
    expect(screen.getByRole('button', { name: /View Deployment Graph/i })).toBeInTheDocument()
  })
})
