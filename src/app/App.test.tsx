import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useSimulatorStore } from '../features/simulator/simulator.store.ts'
import App from './App.tsx'

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))

const runToEnd = () => {
  click('Chạy mô phỏng')
  act(() => {
    vi.advanceTimersByTime(3100)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  useSimulatorStore.getState().loadScenario('baseline')
  useSimulatorStore.setState({
    view: 'presentation',
    snapshotA: null,
    snapshotB: null,
    previousResult: null,
    previousLabel: null,
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('presentation flow', () => {
  test('landing leads into the simulator', () => {
    useSimulatorStore.setState({ view: 'landing' })
    render(<App />)
    expect(screen.getByRole('link', { name: /Các định nghĩa Mác-xít cơ bản/ })).toHaveAttribute(
      'href',
      '/marxism.html',
    )
    click('Bắt đầu thuyết trình')
    expect(screen.getByRole('heading', { name: 'Quán cà phê cơ sở' })).toBeInTheDocument()
    expect(screen.getByText('Chưa có kết quả')).toBeInTheDocument()
  })

  test('running the baseline reveals the documented result after the animation', () => {
    render(<App />)
    click('Chạy mô phỏng')
    expect(screen.queryByText('150%')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3100)
    })
    expect(screen.getByText('150%')).toBeInTheDocument()
    expect(screen.getAllByText(/5\.000\.000/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Câu hỏi thảo luận/i)).toBeInTheDocument()
  })

  test('a control changes the draft, flags the stale result, and reset restores the scenario', () => {
    render(<App />)
    runToEnd()

    const wageSlider = screen.getByLabelText('Tiền công mỗi giờ (thanh trượt)')
    fireEvent.change(wageSlider, { target: { value: '22000' } })
    expect(useSimulatorStore.getState().draftInput.hourlyWage).toBe(22_000)
    expect(screen.getByText(/Thông số đã đổi/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chạy lại' })).toBeInTheDocument()

    click('Đặt lại')
    expect(useSimulatorStore.getState().draftInput.hourlyWage).toBe(30_000)
    expect(screen.getByText('Chưa có kết quả')).toBeInTheDocument()
  })

  test('an edited run does not show the canned observation of the scenario', () => {
    render(<App />)
    click(/Thừa nhân công/)
    runToEnd()
    expect(screen.getByText(/Tổng tiền công tăng gấp đôi/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Số công nhân (thanh trượt)'), {
      target: { value: '20' },
    })
    runToEnd()
    expect(screen.queryByText(/Tổng tiền công tăng gấp đôi/)).not.toBeInTheDocument()
    expect(screen.getByText(/khác kịch bản gốc ở 1 thông số/)).toBeInTheDocument()
  })

  test('a second run shows the change since the previous run', () => {
    render(<App />)
    runToEnd()
    expect(screen.queryByText(/so với lần trước/)).not.toBeInTheDocument()

    click(/Giảm tiền công/)
    runToEnd()
    expect(screen.getByText('▲▼ so với lần trước: Cơ sở')).toBeInTheDocument()
    expect(screen.getByText('▲ 90,9 điểm %')).toBeInTheDocument()
    expect(screen.getAllByText(/▼ 320\.000/).length).toBeGreaterThan(0)
  })

  test('keyboard shortcuts pick a scenario and run it, but not while typing', () => {
    render(<App />)
    fireEvent.keyDown(window, { key: '2' })
    expect(useSimulatorStore.getState().selectedScenarioId).toBe('lower-wage')

    fireEvent.keyDown(screen.getByLabelText(/^Số công nhân/, { selector: 'input[type="text"]' }), {
      key: '3',
    })
    expect(useSimulatorStore.getState().selectedScenarioId).toBe('lower-wage')

    // A slider keeps focus after being dragged; shortcuts must still work from there.
    fireEvent.keyDown(screen.getByLabelText('Tiền công mỗi giờ (thanh trượt)'), { key: 'r' })
    expect(useSimulatorStore.getState().simulationStatus).toBe('running')
  })

  test('the understaffed scenario shows the overload and the lower productivity', () => {
    render(<App />)
    runToEnd()
    expect(screen.queryByText(/Quá tải:/)).not.toBeInTheDocument()

    fireEvent.keyDown(window, { key: '8' })
    expect(useSimulatorStore.getState().selectedScenarioId).toBe('understaffed')
    runToEnd()
    expect(
      screen.getByText(/Quá tải: mỗi người phải làm 33,3 ly, mức hiệu quả 24 ly/),
    ).toBeInTheDocument()
    expect(screen.getByText(/năng suất còn 2,65 ly\/giờ/)).toBeInTheDocument()
  })

  test('typed values are clamped to the allowed range', () => {
    render(<App />)
    const workers = screen.getByLabelText(/^Số công nhân/, { selector: 'input[type="text"]' })
    fireEvent.focus(workers)
    fireEvent.change(workers, { target: { value: '999' } })
    fireEvent.blur(workers)
    expect(useSimulatorStore.getState().draftInput.employeeCount).toBe(20)

    fireEvent.focus(workers)
    fireEvent.change(workers, { target: { value: 'abc' } })
    fireEvent.blur(workers)
    expect(useSimulatorStore.getState().draftInput.employeeCount).toBe(20)
  })

  test('selecting a scenario loads its parameters', () => {
    render(<App />)
    click(/Giảm tiền công/)
    expect(useSimulatorStore.getState().draftInput.hourlyWage).toBe(22_000)
    expect(screen.getByRole('heading', { name: 'Giảm tiền công' })).toBeInTheDocument()
  })

  test('compare is available only after both A and B are saved', () => {
    render(<App />)
    runToEnd()
    const compare = screen.getByRole('button', { name: 'So sánh A và B' })
    expect(compare).toBeDisabled()

    click('Lưu làm A')
    expect(compare).toBeDisabled()

    click(/Giảm tiền công/)
    runToEnd()
    click('Lưu làm B')
    expect(screen.getByRole('button', { name: 'So sánh A và B' })).toBeEnabled()
    expect(useSimulatorStore.getState().snapshotA?.result.totalWages).toBe(1_200_000)
    expect(useSimulatorStore.getState().snapshotB?.result.totalWages).toBe(880_000)
  })
})
